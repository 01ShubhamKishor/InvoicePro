from sqlalchemy import Column, Integer, String, Float, DateTime
from .database import Base
import datetime

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    category = Column(String)
    rate = Column(Float)
    stock = Column(Integer, default=0)
    barcode = Column(String, nullable=True)

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True)
    invoice_no = Column(String, unique=True)

    naam = Column(String)
    phone = Column(String)
    product_name = Column(String)
    quantity = Column(Integer)
    price = Column(Float)

    total = Column(Float)
    paid = Column(Float, default=0)
    due = Column(Float)
    payment_mode = Column(String)

    # YE NAYA HAI - kab becha, ye time save hoga
    created_at = Column(DateTime, default=datetime.datetime.now)


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)