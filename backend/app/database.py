import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.models import Base  # Add this import


DATABASE_URL = os.getenv("DATABASE_URL") # Use this for SQLite
# DATABASE_URL = "postgresql+asyncpg://user:password@localhost/dbname"  # Use this for PostgreSQL

engine = create_async_engine(DATABASE_URL, echo=True)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)