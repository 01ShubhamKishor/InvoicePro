from pydantic import BaseModel

class InvoiceCreate(BaseModel):
    naam: str
    phone: str
    product_name: str
    quantity: int
    price: float
    paid: float = 0
    payment_mode: str  # CASH, UPI, MIX