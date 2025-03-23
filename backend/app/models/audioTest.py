import joblib
import pandas as pd
import asyncio
from whisper import whisper_request
from audioFeatures import compute_speech_features

# Path to your test audio file
testAudio = "/Users/parthspoudel/Documents/Github/AudioData/audio12_16khz.wav"

# Compute pause-related features
features = compute_speech_features(testAudio)

# Get word count and other info using Whisper
response = asyncio.run(whisper_request(testAudio))

# Build the model input features dictionary (make sure keys match training)
modelFeatures = {
    'Words_Per_Second': response["word_count"] / features['Response_Duration'],
    'Pause_Frequency': (features['Pause_Frequency'] / response["word_count"]) * 100,
    'Avg_Pause_Duration': features['Avg_Pause_Duration'],
    'Medium_Pauses': features['Medium_Pauses'],
    'Long_Pauses': features['Long_Pauses'],
    'Response_Duration': features['Response_Duration']
}

# Convert dictionary to a DataFrame (1 sample, same columns as training)
modelFeatures_df = pd.DataFrame([modelFeatures])
print("Features for inference:")
print(modelFeatures_df)

# Load the downloaded model (ensure the path is correct)
model = joblib.load('../../best_audio_model.pkl')

# Predict the fluency score using the model
predictions = model.predict(modelFeatures_df)
print("Predicted Fluency Score:", predictions)

