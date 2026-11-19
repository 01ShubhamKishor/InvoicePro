# backend/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from app.database import get_db
import app.models as models
router = APIRouter(prefix="/auth", tags=["Auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "hisabkitab-secret-key-change-kar-dena"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 din tak login rahega

def get_password_hash(password: str):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

# @router.post("/register")
# def register(username: str, password: str, db: Session = Depends(get_db)):
#     existing = db.query(models.User).filter(models.User.username == username).first()
#     if existing:
#         raise HTTPException(400, "Username already hai")
#     user = models.User(username=username, password_hash=get_password_hash(password))
#     db.add(user)
#     db.commit()
#     return {"msg": "User Created succesfully"}

@router.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(401, "Wrong username / password")
    token = jwt.encode({"sub": username, "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer", "username": username}