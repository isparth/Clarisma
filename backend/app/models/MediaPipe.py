
import os
import cv2
import ssl
import certifi
import ffmpeg
import shutil
import aiofiles
from fastapi import HTTPException, UploadFile
from fer import Video
from fer import FER
from moviepy.editor import *
import numpy as np
import math


import mediapipe as mp

from app.models.openAI import openai_request
from app.models.whisper import whisper_request
from app.models.audio import audio_features

# For Gaze detection LaserGaze
from LaserGaze.main import main
from LaserGaze.landmarks import *
from LaserGaze.face_model import *
from LaserGaze.AffineTransformer import AffineTransformer
from LaserGaze.EyeballDetector import EyeballDetector

import asyncio


ssl_context = ssl.create_default_context(cafile=certifi.where())

# Model paths
FACE_MODEL_PATH = "./face_landmarker_v2_with_blendshapes.task"
HANDS_MODEL_PATH = "./hand_landmarker.task"

# Initialize MediaPipe Components
BaseOptions = mp.tasks.BaseOptions
VisionRunningMode = mp.tasks.vision.RunningMode

# Initialise Face Landmarker
FaceLandmarker = mp.tasks.vision.FaceLandmarker
FaceLandmarkerOptions = mp.tasks.vision.FaceLandmarkerOptions

# Initialize Hand Landmarker
HandLandmarker = mp.tasks.vision.HandLandmarker
HandLandmarkerOptions = mp.tasks.vision.HandLandmarkerOptions

# Initialize Options for Face and Hand Detectors
face_options = FaceLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=FACE_MODEL_PATH),
    running_mode=VisionRunningMode.VIDEO
)

hand_options = HandLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=HANDS_MODEL_PATH),
    running_mode=VisionRunningMode.VIDEO,
    num_hands=2
)

# Initiliase For LazeGaze Face detection
left_detector = EyeballDetector(DEFAULT_LEFT_EYE_CENTER_MODEL)
right_detector = EyeballDetector(DEFAULT_RIGHT_EYE_CENTER_MODEL)


async def extract_audio_from_video(video_path, audio_path):
    try:
        await asyncio.to_thread(ffmpeg.input(video_path, fflags='+genpts').output(audio_path, acodec='pcm_s16le').run)
    except ffmpeg.Error as e:
        print(f"FFmpeg failed to extract audio: {str(e)}")
        raise RuntimeError(f"Audio extraction failed: {str(e)}")

# Function to calculate the Euclidean distance between two landmarks
def calculate_euclidean_distance(landmark1, landmark2):

    # Extract coordinates from the landmarks
    x1, y1, z1 = landmark1.x, landmark1.y, landmark1.z
    x2, y2, z2 = landmark2.x, landmark2.y, landmark2.z
    
    # Calculate Euclidean distance
    distance = math.sqrt((x2 - x1)**2 + (y2 - y1)**2 + (z2 - z1)**2)
    
    return distance

async def process_video_file(question,file: UploadFile):
    """
    Processes the uploaded video file by:
    1. Saving it temporarily.
    2. Extracting and transcribing its audio.
    3. Using MediaPipe to detect face and pose landmarks frame-by-frame.
    4. Cleaning up temporary files.
    Returns a dictionary of transcription, face landmarks, and pose landmarks.
    """
    print(question)

    # Set up temporary directory and file paths
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    video_path = os.path.join(upload_dir, "temp_video.mp4")
    audio_path = os.path.join(upload_dir, "temp_audio.wav")


    async with aiofiles.open(video_path, "wb") as buffer:
                await buffer.write(await file.read())

    await extract_audio_from_video(video_path, audio_path)

    # Api Requests
    #transcription = await whisper_request(audio_path)
    #APIresponse = await openai_request(question,transcription)

    # Audio pipeline
    features = audio_features(audio_path)
  

   
    # Initialize video capture
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise HTTPException(status_code=500, detail="Could not open video file")

    # Lists to store landmarks for each frame
    hand_landmarks_data = []
    eye_Gaze_data = []
    
    detector = FER(mtcnn=True)

    
    # {'angry': 0.02, 'disgust': 0.0, 'fear': 0.05, 'happy': 0.16, 'neutral': 0.09, 'sad': 0.27, 'surprise': 0.41}
    posEmotionCount = 0
    negEmotionCount = 0
    neutralEmotionCount = 0
    total = 0

    # Create face and pose landmarker instances once, use throughout
    with FaceLandmarker.create_from_options(face_options) as face_landmarker, \
        HandLandmarker.create_from_options(hand_options) as hand_landmarker:

        frame_count = 0
        frames_with_hands = 0
        current_landmark0 = None
        current_landmark1 = None
        previous_landmark0 = None
        previous_landmark1 = None
        total_distance = 0
        while cap.isOpened():
            
            if (frame_count % 2 == 0):
                
                ret, frame = cap.read()
                if not ret:
                    # No more frames to read
                    print("Error")
                    break
                
                # Emotion detection   
                try:
                    emotion, score = detector.top_emotion(frame)  # e.g., ('happy', 0.99)
                except Exception as e:
                    print(f"Error detecting emotion for frame {frame_count}: {str(e)}")
                    emotion, score = None, None

                # Handle case where no face or emotion is detected
                if emotion is not None and score is not None and score > 0.6:
                    # Count positive, neutral, and negative emotions
                    if emotion == "happy" or emotion == "suprise":  # Use in-list for clean logic
                        posEmotionCount += 1
                        total += 1
                    elif emotion == "neutral":
                        neutralEmotionCount += 1
                        total += 1
                    else:
                        negEmotionCount += 1
                        total += 1

                # Convert BGR to RGB for MediaPipe
                frame= cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame)

                # Get the current frame timestamp in milliseconds
                timestamp_ms = int(cap.get(cv2.CAP_PROP_POS_MSEC))
    
                # Detect face landmarks + Eyecontact detection
                face_landmarker_result = face_landmarker.detect_for_video(mp_image, timestamp_ms)
                
                if face_landmarker_result.face_landmarks:
                    lms_s = np.array([[lm.x, lm.y, lm.z] for lm in face_landmarker_result.face_landmarks[0]])
                    lms_2 = (lms_s[:, :2] * [frame.shape[1], frame.shape[0]]).round().astype(int)

                    mp_hor_pts = [lms_s[i] for i in OUTER_HEAD_POINTS]
                    mp_ver_pts = [lms_s[i] for i in [NOSE_BRIDGE, NOSE_TIP]]
                    model_hor_pts = OUTER_HEAD_POINTS_MODEL
                    model_ver_pts = [NOSE_BRIDGE_MODEL, NOSE_TIP_MODEL]

                    at = AffineTransformer(lms_s[BASE_LANDMARKS,:], BASE_FACE_MODEL, mp_hor_pts, mp_ver_pts, model_hor_pts, model_ver_pts)

                    indices_for_left_eye_center_detection = LEFT_IRIS + ADJACENT_LEFT_EYELID_PART
                    left_eye_iris_points = lms_s[indices_for_left_eye_center_detection, :]
                    left_eye_iris_points_in_model_space = [at.to_m2(mpp) for mpp in left_eye_iris_points]
                    left_detector.update(left_eye_iris_points_in_model_space, timestamp_ms)

                    indices_for_right_eye_center_detection = RIGHT_IRIS + ADJACENT_RIGHT_EYELID_PART
                    right_eye_iris_points = lms_s[indices_for_right_eye_center_detection, :]
                    right_eye_iris_points_in_model_space = [at.to_m2(mpp) for mpp in right_eye_iris_points]
                    right_detector.update(right_eye_iris_points_in_model_space, timestamp_ms)

                    left_gaze_vector, right_gaze_vector = None, None

                    if left_detector.center_detected: #and self.right_detector.center_detected
                        left_eyeball_center = at.to_m1(left_detector.eye_center)
                        left_pupil = lms_s[LEFT_PUPIL]
                        left_gaze_vector = (left_pupil - left_eyeball_center)
                        left_proj_point = left_pupil + left_gaze_vector*5.0

                    if right_detector.center_detected:
                        right_eyeball_center = at.to_m1(right_detector.eye_center)
                        right_pupil = lms_s[RIGHT_PUPIL]
                        right_gaze_vector = (right_pupil - right_eyeball_center)
                        right_proj_point = right_pupil + right_gaze_vector*5.0
                
                    # For visualisation

                    if left_detector.center_detected and right_detector.center_detected:
                        p1 = relative(left_pupil[:2], frame.shape)
                        p2 = relative(left_proj_point[:2], frame.shape)
        
                        p1 = relative(right_pupil[:2], frame.shape)
                        p2 = relative(right_proj_point[:2], frame.shape)
                        cv2.putText(frame, str(right_proj_point*10), (10, frame.shape[0] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                        cv2.putText(frame, str(left_proj_point*10), (10, frame.shape[0] - 50), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                    else:
                        print(left_detector)
                        print(right_detector)
                        print(left_detector.center_detected)
                        print(right_detector.center_detected)
                        text_location = (10, frame.shape[0] - 10)
                        cv2.putText(frame, "Calibration...", text_location, cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

                    # for Visualisation
                    cv2.imshow('LaserGaze', frame)
                    if cv2.waitKey(5) & 0xFF == 27:
                        break
                    

                    # eye_Gaze_data.append({
                    #     'frame': frame_count,
                    #     'left_gaze': left_gaze_vector,
                    #     'right_gaze': right_gaze_vector,
                        
                    # })


                # # Detect hand landmarks
                # hand_landmarker_result = hand_landmarker.detect_for_video(mp_image, timestamp_ms)
                # if hand_landmarker_result.hand_landmarks and len(hand_landmarker_result.hand_landmarks) > 0:
                #     if hand_landmarker_result.hand_landmarks[0]:
                #         frames_with_hands += 1 
                #         current_landmark0  = hand_landmarker_result.hand_landmarks[0][5]
                #         if previous_landmark0:
                #             distance0 = calculate_euclidean_distance(current_landmark0,previous_landmark0)
                #             total_distance += distance0
                #         previous_landmark0 = current_landmark0

                #     elif hand_landmarker_result.hand_landmarks[0] and hand_landmarker_result.hand_landmarks[1]:
                #         frames_with_hands += 1
                #         current_landmark0  = hand_landmarker_result.hand_landmarks[0][5]
                #         current_landmark1  = hand_landmarker_result.hand_landmarks[1][5]
                #         if previous_landmark0 and previous_landmark1:
                #             distance0 = calculate_euclidean_distance(current_landmark0,previous_landmark0)
                #             distance1 = calculate_euclidean_distance(current_landmark1,previous_landmark1)
                #             total_distance += (distance0+distance1)/2
                #         previous_landmark0 = current_landmark0
                #         previous_landmark1 = current_landmark1

                #     else:
                #         print("no hands detected")
                # else:
                #     print("Empty hand array")

                frame_count +=1
            else:
                frame_count += 1

    # Release the video capture
    cap.release()

    # Print results for debugging (optional)
    # print("Transcription:", transcription)

    print("positive emotion", posEmotionCount)
    print("negative emotion", negEmotionCount)
    print("neutral emotion", neutralEmotionCount)
    print("--------------------")
    print(frame_count)
    print(frames_with_hands)
    print("--------------------")
    
    print("--------------------")



    await asyncio.to_thread(os.remove, video_path)
    await asyncio.to_thread(os.remove, audio_path)

    # Return the processed data
    return {
        # "transcription": transcription,
        # "landmarks": face_landmarks_data,
      
    }