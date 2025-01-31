import librosa
import numpy as np

def audio_features(audio_file):
    y, sr = librosa.load(audio_file, sr=16000)

    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)

    # Pitch Features mean and deviation
    valid_pitch = pitches[pitches > 0]  # Where pitch is not 0
    
    if valid_pitch.size > 0:
        pitch_mean = np.mean(valid_pitch)
        pitch_deviation = np.std(valid_pitch)
    else:
        pitch_mean = 0
        pitch_deviation = 0
    
    # Intensity(loudness) features mean and deviation
    rms = librosa.feature.rms(y=y)
    intensity_mean = np.mean(rms)
    intensity_deviation = np.std(rms)

    non_silent_intervals = librosa.effects.split(y, top_db=30)  # Use positive value for `top_db`

    pause_durations = []  # Initialise an empty list


    for i in range(1, len(non_silent_intervals)):
      
        pause_duration = (non_silent_intervals[i][0] - non_silent_intervals[i-1][1]) / sr
        pause_durations.append(pause_duration)  # Append the calculated pause duration


    avg_pause_duration = np.mean(pause_durations)

    # Jitter measurement using approximations 
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
    if(np.mean(spectral_centroid) > 0):
        jitter = np.std(spectral_centroid) / np.mean(spectral_centroid)
    else:
        jitter = 0
    
    features = {
        "pitch_mean": pitch_mean,
        "pitch_deviation" : pitch_deviation,
        "intensity_mean" : intensity_mean,
        "intensity_deviation": intensity_deviation,
        "pause_duration": avg_pause_duration,
        "pause_count": len(pause_durations),
        "jitter" : jitter
        
    }
    print(features)

    return features

    



    







