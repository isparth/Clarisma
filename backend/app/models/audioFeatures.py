import librosa
import numpy as np

def compute_speech_features(audio_file, sr=16000, top_db=30):
    min_pause_duration=0.25
    
    # Load the audio file
    y, sr = librosa.load(audio_file, sr=sr)
    
    # Trim leading & trailing silence
    y_trimmed, _ = librosa.effects.trim(y, top_db=top_db)

    # Detect non-silent intervals (internal speech segments)
    speech_intervals = librosa.effects.split(y_trimmed, top_db=top_db)

    # Compute total response duration (speech only)
    response_duration = librosa.get_duration(y=y_trimmed, sr=sr)

    # Convert speech intervals to pause durations, ignoring very short pauses
    pauses = []
    for i in range(1, len(speech_intervals)):
        # End of previous speech segment and start of next
        pause_start = speech_intervals[i-1][1] / sr  
        pause_end = speech_intervals[i][0] / sr  
        pause_duration = pause_end - pause_start
        if pause_duration >= min_pause_duration:
            pauses.append(pause_duration)

    # Compute pause-based features
    pause_freq = len(pauses) 
    avg_pause = np.mean(pauses) if pauses else 0  
    medium_pauses = sum(1 for p in pauses if 1.5 <= p < 2.5)  
    long_pauses = sum(1 for p in pauses if p >= 2.5) 

    # Return extracted features
    return {
        'Pause_Frequency': pause_freq,
        'Avg_Pause_Duration': avg_pause,
        'Medium_Pauses': medium_pauses,
        'Long_Pauses': long_pauses,
        'Response_Duration': response_duration
    }
