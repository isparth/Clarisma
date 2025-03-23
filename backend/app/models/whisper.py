from openai import OpenAI
import re

client = OpenAI(
  api_key="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"
)

async def whisper_request(audio_file):
    # Load your audio file
    inputfile = open(audio_file, "rb")

    # Define the prompt with filler words
    
    whisperPrompt = """
    You are a transcription assistant. Your task is to transcribe audio exactly as it is spoken, 
    capturing every word, hesitation, filler word (e.g., "um," "uh," "like"), and pause. 
    Do not correct grammar, remove filler words, or rephrase content. 
    Ensure that the transcription reflects the speaker's natural speech patterns and 
    includes all disfluencies, repetitions, and stutters exactly as heard.
    """
    
    # Transcribe the audio with the specified prompt
    transcription = client.audio.transcriptions.create(
        model="whisper-1", 
        file=inputfile,
        prompt=whisperPrompt
    )

     # Get the transcribed text
    text = transcription.text.strip()

    # Count words in the transcription
    word_count = len(re.findall(r'\b\w+\b', text))


    # Output the transcription 
    print(transcription.text)

    return {
        "word_count": word_count,
        "text": text
    }