from fastapi import FastAPI, UploadFile, File
from app.video.MediaPipe import process_video_file

app = FastAPI()

@app.post("/run-video")
async def run_video(file: UploadFile = File(...)):
    file_path = f"uploads/temp_video.mp4"
    with open(file_path, "wb") as f:
        f.write(file.file.read())

    
    result = await process_video_file(file_path)

    return result
       
    