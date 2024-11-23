import os
from dotenv import load_dotenv


from fastapi import Depends, FastAPI, APIRouter, Request
from httpx_oauth.exceptions import GetIdEmailError
from fastapi.responses import RedirectResponse


from app.schemas import UserCreate, UserRead, UserUpdate
from app.users import auth_backend,  fastapi_users
from httpx_oauth.clients.google import GoogleOAuth2




auth_router = APIRouter()

load_dotenv()


google_oauth_client = GoogleOAuth2(
    client_id="232005223690-j7dtcqjqs6jmqd36pqrpustfce14mp85.apps.googleusercontent.com",
    client_secret="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"
   
)

auth_router.include_router(
    fastapi_users.get_auth_router(auth_backend), prefix="/auth/jwt", tags=["auth"]
)
auth_router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)
auth_router.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/auth",
    tags=["auth"],
)
auth_router.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix="/auth",
    tags=["auth"],
)
auth_router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)
auth_router.include_router(
    fastapi_users.get_oauth_router(google_oauth_client, auth_backend, "your-secret-key"),
    prefix="/auth/google",
    tags=["auth"],
)


