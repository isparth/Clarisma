import os
import cv2
import ssl
import certifi
import aiofiles
from fastapi import HTTPException, UploadFile
from fer import FER

import math
import joblib
import pandas as pd
import mediapipe as mp
import asyncio


# Set up SSL context
ssl_context = ssl.create_default_context(cafile=certifi.where())

# Define the model path
MODEL_PATH = "../models/pose_landmarker_full.task"

# Initialize MediaPipe Components
BaseOptions = mp.tasks.BaseOptions
VisionRunningMode = mp.tasks.vision.RunningMode
PoseLandmarker = mp.tasks.vision.PoseLandmarker
PoseLandmarkerOptions = mp.tasks.vision.PoseLandmarkerOptions

# Create a pose landmarker instance with the video mode:
options = PoseLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=MODEL_PATH),
    running_mode=VisionRunningMode.VIDEO
)


# Function to calculate the Euclidean distance between two landmarks
def calculate_euclidean_distance(landmark1, landmark2):
    x1, y1, z1 = landmark1.x, landmark1.y, landmark1.z
    x2, y2, z2 = landmark2.x, landmark2.y, landmark2.z
    distance = math.sqrt((x2 - x1)**2 + (y2 - y1)**2 + (z2 - z1)**2)
    return distance

# Helper function to check if a landmark is valid
def is_valid(landmark, vis_threshold=0.55, pres_threshold=0.70):
    return landmark is not None and landmark.visibility > vis_threshold and landmark.presence > pres_threshold

async def process_video_file(video_path):

    # Initialize video capture
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise HTTPException(status_code=500, detail="Could not open video file")

    detector = FER(mtcnn=False)
    posEmotionCount = 0
    total = 1
    frame_count = 0
    frames_with_hands = 0
    total_distance = 0

    # Get frame rate and compute frame duration in milliseconds
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_time_ms = 1000 / fps  # Duration of one frame in milliseconds

    # Initialize manual timestamp
    timestamp_ms = 0

    # Initialize previous landmark variables
    previous_left_wrist = previous_left_index = previous_left_pinky = None
    previous_right_wrist = previous_right_index = previous_right_pinky = None

    # Process video frames using MediaPipe
    with PoseLandmarker.create_from_options(options) as landmarker:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            current_time_sec = timestamp_ms / 1000

            # Process every 5th frame for performance
            if frame_count % 5 != 0:
                frame_count += 1
                timestamp_ms += frame_time_ms
                continue

            # Emotion detection using FER
            try:
                emotion, score = detector.top_emotion(frame)  # e.g., ('happy', 0.99)
            except Exception as e:
                print(f"Error detecting emotion for frame {frame_count}: {str(e)}")
                emotion, score = None, None

            if emotion is not None and score is not None and score > 0.5:
                if emotion == "happy" or emotion == "surprise":
                    posEmotionCount += 1
                total += 1

            # Convert BGR to RGB for MediaPipe
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)

            # Use manual timestamp for detection
            pose_landmarker_result = landmarker.detect_for_video(mp_image, int(timestamp_ms))

            if pose_landmarker_result.pose_world_landmarks:
                landmarks = pose_landmarker_result.pose_world_landmarks[0]
                if landmarks and len(landmarks) > 20:
                    # --- Extract Left Hand Landmarks ---
                    left_wrist  = landmarks[15]
                    left_pinky  = landmarks[17]
                    left_index  = landmarks[19]

                    # --- Extract Right Hand Landmarks ---
                    right_wrist = landmarks[16]
                    right_pinky = landmarks[18]
                    right_index = landmarks[20]

                    # --- Calculate distances for left hand ---
                    left_distances = []
                    if is_valid(left_wrist) and previous_left_wrist is not None:
                        left_distances.append(calculate_euclidean_distance(left_wrist, previous_left_wrist))
                    if is_valid(left_index) and previous_left_index is not None:
                        left_distances.append(calculate_euclidean_distance(left_index, previous_left_index))
                    if is_valid(left_pinky) and previous_left_pinky is not None:
                        left_distances.append(calculate_euclidean_distance(left_pinky, previous_left_pinky))
                    avg_left_distance = sum(left_distances) / len(left_distances) if left_distances else 0

                    # --- Calculate distances for right hand ---
                    right_distances = []
                    if is_valid(right_wrist) and previous_right_wrist is not None:
                        right_distances.append(calculate_euclidean_distance(right_wrist, previous_right_wrist))
                    if is_valid(right_index) and previous_right_index is not None:
                        right_distances.append(calculate_euclidean_distance(right_index, previous_right_index))
                    if is_valid(right_pinky) and previous_right_pinky is not None:
                        right_distances.append(calculate_euclidean_distance(right_pinky, previous_right_pinky))
                    avg_right_distance = sum(right_distances) / len(right_distances) if right_distances else 0

                    if left_distances or right_distances:
                        frames_with_hands += 1

                    # Sum the average distances from both hands
                    total_distance += avg_left_distance + avg_right_distance

                    # --- Update Previous Landmarks for Next Frame ---
                    if is_valid(left_wrist):
                        previous_left_wrist = left_wrist
                    if is_valid(left_index):
                        previous_left_index = left_index
                    if is_valid(left_pinky):
                        previous_left_pinky = left_pinky

                    if is_valid(right_wrist):
                        previous_right_wrist = right_wrist
                    if is_valid(right_index):
                        previous_right_index = right_index
                    if is_valid(right_pinky):
                        previous_right_pinky = right_pinky
                else:
                    print("No world landmarks detected or insufficient number of landmarks.")
            else:
                print("No world Landmarks detected.")

            frame_count += 1
            timestamp_ms += frame_time_ms

    # Release the video capture
    cap.release()

    # Compute video/body features (avoid division by zero for duration)
    safe_duration = current_time_sec if current_time_sec > 0 else 1
    video_features = {
        "Duration": current_time_sec,
        "positive": posEmotionCount / total,
        "hand_count": frames_with_hands / max(1, frame_count / 5),
        "hand_movement": total_distance / safe_duration
    }
    print("No Frames Left or end of video reached.")

    # Load the non-verbal (body) model and make predictions
    modelbody = joblib.load('../models/nonVerbal_model.pkl')
    new_body_data = pd.DataFrame([video_features])
    predictions = modelbody.predict(new_body_data)
    predictions = predictions.tolist()

    # Clean up temporary files
    await asyncio.to_thread(os.remove, video_path)

    return {
        "Body Predictions": predictions,
        "Body Features": video_features,
    }