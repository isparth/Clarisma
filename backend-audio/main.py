from fastapi import FastAPI, UploadFile, File, Form
import pandas as pd
import joblib
import os
import asyncio


from app.audio.whisper import whisper_request
from app.audio.openAI import openai_request
from app.audio.audioFeatures import compute_speech_features

app = FastAPI()

@app.post("/run-audio")
async def run_audio(question: str = Form(...), file: UploadFile = File(...)):
    audio_path = f"uploads/temp_audio.wav"
    with open(audio_path, "wb") as f:
        f.write(file.file.read())
   # Audio pipeline
    audio_features = compute_speech_features(audio_path)
   
    # Get word count and other info using Whisper
    response = await whisper_request(audio_path)
    APIresponse = await openai_request(question, response["text"])

    modelFeatures = {
        'Words_Per_Second': response["word_count"] / audio_features['Response_Duration'],
        'Pause_Frequency': (audio_features['Pause_Frequency'] / response["word_count"]) * 100,
        'Avg_Pause_Duration': audio_features['Avg_Pause_Duration'],
        'Medium_Pauses': audio_features['Medium_Pauses'],
        'Long_Pauses': audio_features['Long_Pauses'],
        'Response_Duration': audio_features['Response_Duration']
    }

    modelFeatures_df = pd.DataFrame([modelFeatures])
    model = joblib.load('./best_audio_model.pkl')
    print("Features for inference:")
    print(modelFeatures_df)

    # Predict the fluency score using the model
    predictionsAudio = model.predict(modelFeatures_df)
    print("Predicted Fluency Score:", predictionsAudio)
    predictionsAudio = predictionsAudio.tolist()

    await asyncio.to_thread(os.remove, audio_path)

    return {
        "transcription": response["text"],
        "modelFeatures": modelFeatures,
        "Feedback": APIresponse,
        "Audio Predictions": predictionsAudio
    }