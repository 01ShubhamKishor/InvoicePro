# Backend/app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine, SessionLocal
import app.models as models
from app.routers import invoice, products
from app.auth import router as auth_router
from app.auth import get_password_hash

# ===== DEFAULT ADMIN =====
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. creating all table
    Base.metadata.create_all(bind=engine)

    # 2. Phir Admin banao
    db = SessionLocal()
    try:
        user = db.query(models.User).filter(models.User.username == "admin").first()
        if not user:
            admin_user = models.User(
                username="admin",
                password_hash=get_password_hash("1234")
            )
            db.add(admin_user)
            db.commit()
            print("✅ Default Admin ban gaya: admin / 1234")
        else:
            print("✅ Admin pehle se hai: admin")
    except Exception as e:
        print("Admin create error:", e)
    finally:
        db.close()
    
    yield  # yaha se app chalegi
    # Band hone pe yaha kuch karna hai to likh sakte hai

app = FastAPI(title="HisabKitab API", lifespan=lifespan)

# CORS pehle - Router se pehle lagana 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(invoice.router)
app.include_router(products.router)
app.include_router(auth_router)

@app.get("/")
def home():
    return {"msg": "HisabKitab Chal Gaya!"}