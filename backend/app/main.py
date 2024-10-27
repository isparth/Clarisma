from fastapi import FastAPI
from app.database import init_db
from app.routers import items  # We'll create this next

app = FastAPI()



@app.on_event("startup")
async def startup():
    await init_db()

@app.get("/")
def read_root():
    return {"message": "Hello, !"}

app.include_router(items.router)