AI-Powered Interview Practice Platform

This repository contains two main components:

Backend: FastAPI application providing RESTful APIs for video processing, transcription, and feedback generation.

Frontend: React application (built with Vite) for user interaction, recording/uploading videos, and displaying feedback.
Prerequisites

Ensure you have the following installed:

Git (v2.30+)
Node.js (v16+) and npm (v8+)
Python (v3.10+)
pip (v22+)
Getting Started

1. Clone the Repository

2. Backend Setup
   The backend uses FastAPI. Follow these steps:

Create and activate a Python environment:

# macOS/Linux

python3 -m venv .venv
source .venv/bin/activate

Install dependencies:
pip install --upgrade pip
pip install -r backend/requirements.txt
Configure environment variables:

Create a .env file inside the backend/ directory using the provided template. And copy paste the env file provided.

Start the FastAPI server:
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000

3. Frontend Setup
   The frontend is built with React and Vite.

Navigate to the frontend directory:
cd frontend

Install Node.js dependencies:
npm install

Start the development server:
npm run dev

The app will be available at http://localhost:3000.

4. Note:
   Ignore the backend_audio and backend_video folders — they were used for Docker purposes.

   Ensure the models are placed in the correct directories to enable inference.
