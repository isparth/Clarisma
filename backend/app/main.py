from fastapi import FastAPI
from app.db import create_db_and_tables
from app.routers.auth import auth_router
from fastapi.middleware.cors import CORSMiddleware
from app.models.MediaPipe import process_video_file
from fastapi import FastAPI, UploadFile, File


app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:5174",
    "http://localhost:5173"   # React frontend origin
    # Add other origins here if necessary
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await create_db_and_tables()

app.include_router(auth_router)

@app.get("/")
def read_root():
    return {"message": "Hello, !"}


@app.post("/process_video")
async def process_video(file: UploadFile = File(...)):
    
    return process_video_file(file)