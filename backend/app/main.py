from fastapi import FastAPI, UploadFile, File, Form, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth
from app.models.MediaPipe import process_video_file

import os
from dotenv import load_dotenv

# Load environment variables from .env (make sure your .env has GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI, and SECRET_KEY)
load_dotenv()

app = FastAPI()

# Configure CORS for your allowed origins (e.g., your React frontend)
origins = [
    "http://localhost:5174",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add session middleware to store user session data.
# The secret key is taken from your .env file (or defaults to "supersecretkey")
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY", "supersecretkey"))

# Configure OAuth with Google using Authlib.
oauth = OAuth()
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

# Public endpoint: Home route.
@app.get("/")
def read_root():
    return {"message": "Hello, !"}

# Authentication endpoints

# Endpoint to start the OAuth flow.
@app.get("/auth/login")
async def login(request: Request):
    # The REDIRECT_URI should match the one you registered with Google.
    redirect_uri = os.getenv("REDIRECT_URI", "http://localhost:8000/auth/callback")
    # Redirects the user to Google's OAuth 2.0 login page.
    return await oauth.google.authorize_redirect(request, redirect_uri)

@app.get("/auth/callback")
async def auth_callback(request: Request):
    # Retrieve the token from the OAuth flow.
    token = await oauth.google.authorize_access_token(request)
    print("Token received:", token)

    # Try to extract user info directly from the token.
    user_info = token.get("userinfo")
    
    # If user_info is not available, fetch it using the userinfo endpoint.
    if not user_info:
        user_info = await oauth.google.userinfo(token=token)
    
    # If we still don't have user info, fail the authentication.
    if not user_info:
        raise HTTPException(status_code=400, detail="OAuth authentication failed")
    
    # Store the user info in the session.
    request.session["user"] = user_info
    return RedirectResponse(url="http://localhost:5173/questions")

# Protected endpoint: Only accessible if the user is logged in.
@app.get("/protected")
async def protected_route(request: Request):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return {"message": "You are authenticated", "user": user}

# Existing endpoint for processing video files.
@app.post("/process_video")
async def process_video(
    question: str = Form(...),  # Extract 'question' from form data
    file: UploadFile = File(...)  # Accept file uploads
):
    print(question)
    return await process_video_file(question, file)