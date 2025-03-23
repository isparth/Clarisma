# database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from databases import Database

# SQLite connection string: users.db is stored locally in the project directory
DATABASE_URL = "sqlite:///./users.db"

# Create the SQLAlchemy engine with SQLite-specific options
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for the ORM models
Base = declarative_base()

# Optional: For asynchronous database queries
database = Database(DATABASE_URL)