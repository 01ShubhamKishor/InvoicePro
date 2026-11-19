from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models

router = APIRouter(prefix="/products", tags=["products"])

# 1. Naya saman add karne ke liye
@router.post("/")
def add_product(name: str, rate: float, category: str = "", stock: int = 0, db: Session = Depends(get_db)):
    p = models.Product(name=name, rate=rate, category=category, stock=stock)
    db.add(p)
    db.commit()
    db.refresh(p)
    return p

# 2. Search karne ke liye
@router.get("/")
def get_products(search: str = "", db: Session = Depends(get_db)):
    query = db.query(models.Product)
    if search:
        query = query.filter(models.Product.name.ilike(f"%{search}%"))
    return query.all()

# 3. EDIT karne ke liye - NAYA
@router.put("/{product_id}")
def update_product(
    product_id: int,
    name: str = None,
    rate: float = None,
    category: str = None,
    stock: int = None,
    db: Session = Depends(get_db)
):
    p = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")

    if name is not None:
        p.name = name
    if rate is not None:
        p.rate = rate
    if category is not None:
        p.category = category
    if stock is not None:
        p.stock = stock

    db.commit()
    db.refresh(p)
    return p

# 4. Delete karne ke liye
@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    p = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(p)
    db.commit()
    return {"deleted": True}