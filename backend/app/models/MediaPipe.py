import cv2
import mediapipe as mp
import os
import shutil
from fastapi import UploadFile, HTTPException
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from moviepy.editor import VideoFileClip
import whisper
import ffmpeg
import certifi
import ssl

ssl_context = ssl.create_default_context(cafile=certifi.where())


# Initialize MediaPipe Face Landmarker
model_path = "./face_landmarker_v2_with_blendshapes.task"  
Pose_Model_Path = "./pose_landmarker_full.task"  

# Initialize Face Landmarks and Options Setup
BaseOptions = mp.tasks.BaseOptions
FaceLandmarker = mp.tasks.vision.FaceLandmarker
FaceLandmarkerOptions = mp.tasks.vision.FaceLandmarkerOptions
VisionRunningMode = mp.tasks.vision.RunningMode

options = FaceLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=model_path),
    running_mode=VisionRunningMode.VIDEO
)

PoseBaseOptions = mp.tasks.BaseOptions
PoseLandmarker = mp.tasks.vision.PoseLandmarker
PoseLandmarkerOptions = mp.tasks.vision.PoseLandmarkerOptions
PoseRunningMode = mp.tasks.vision.RunningMode

# Create a pose landmarker instance with the video mode:
PoseOptions = PoseLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=Pose_Model_Path),
    running_mode=VisionRunningMode.VIDEO)


def detect_Pose_Landmarks(video_path):

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise HTTPException(status_code=500, detail="Could not open video file")

    frame_count = 0
    Pose_landmarks_data = []

    with PoseLandmarker.create_from_options(PoseOptions) as landmarker:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame_rgb)
            frame_timestamp_ms = int(cap.get(cv2.CAP_PROP_POS_MSEC))

            # Perform face landmarking
            pose_landmarker_result = landmarker.detect_for_video(mp_image, frame_timestamp_ms)
            Pose_landmarks_data.append({
                        'frame': frame_count,
                        'landmarks':pose_landmarker_result.pose_landmarks
                    })
            
            #_____________SHOW LANDMARKS ON THE VIDEO____________________

            for Landmarks in pose_landmarker_result.pose_landmarks:
                
                for lm in Landmarks:
                    x, y = int(lm.x * frame.shape[1]), int(lm.y * frame.shape[0])
                    cv2.circle(frame, (x, y), 2, (0, 255, 0), -1)  # Draw each landmark as a small circle


            
            cv2.imshow("Landmarked Video", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

            frame_count += 1

    cap.release()
    

    return Pose_landmarks_data

def extract_audio_from_video(video_path, audio_path):
    (
        ffmpeg
        .input(video_path)
        .output(audio_path, acodec='pcm_s16le')
        .run()
    )

def transcribe_audio(audio_path):
    model = whisper.load_model("base.en")
    result = model.transcribe(audio_path)
    return result['text']


#Function to detect facial landmarks
def detect_Face_Landmarks(video_path):

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise HTTPException(status_code=500, detail="Could not open video file")

    frame_count = 0
    landmarks_data = []

    with FaceLandmarker.create_from_options(options) as landmarker:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame_rgb)
            frame_timestamp_ms = int(cap.get(cv2.CAP_PROP_POS_MSEC))

            # Perform face landmarking
            face_landmarker_result = landmarker.detect_for_video(mp_image, frame_timestamp_ms)
            landmarks_data.append({
                        'frame': frame_count,
                        'landmarks':face_landmarker_result.face_landmarks 
                    })
            
            #_____________SHOW LANDMARKS ON THE VIDEO____________________

            # for face_landmarks in face_landmarker_result.face_landmarks:
                
            #     for lm in face_landmarks:
            #         x, y = int(lm.x * frame.shape[1]), int(lm.y * frame.shape[0])
            #         cv2.circle(frame, (x, y), 2, (0, 255, 0), -1)  # Draw each landmark as a small circle


            
            # cv2.imshow("Landmarked Video", frame)
            # if cv2.waitKey(1) & 0xFF == ord('q'):
            #     break

            frame_count += 1

    cap.release()
    

    return landmarks_data


def process_video_file(file: UploadFile):
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    video_path = os.path.join(upload_dir, "temp_video.webm")
    audio_path = os.path.join(upload_dir, "temp_audio.wav")

    # Save the uploaded video file as a temporarty file for analysis
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract audio and transcribe
    extract_audio_from_video(video_path, audio_path)
    transcription = transcribe_audio(audio_path)

    # Detect facial landmarks
    landmarks_data = detect_Face_Landmarks(video_path)
    Pose_landmarks_data = detect_Pose_Landmarks(video_path)

    # Clean up temporary files
    os.remove(video_path)
    os.remove(audio_path)

    return {"transcription": transcription, "landmarks": landmarks_data, "Pose_landmarks": Pose_landmarks_data}