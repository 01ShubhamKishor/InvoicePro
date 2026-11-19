
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Render se DATABASE_URL aayegi, nahi aayi to local me SQLite chalega
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./hisab.db")

# Render Postgres ka URL "postgres://" se aata hai, usko "postgresql://" karna padta hai
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()