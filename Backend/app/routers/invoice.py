from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from reportlab.pdfgen import canvas

router = APIRouter(prefix="/invoices", tags=["Invoices"])

from sqlalchemy import func

# @router.post("/")
# @router.get("/dashboard/summary")
# @router.get("/dashboard/pending")
# @router.get("/dashboard/today")
# @router.get("/")
# @router.post("/{invoice_id}/pay")
# @router.get("/{invoice_id}/pdf")

from sqlalchemy import func, case

@router.get("/dashboard/summary")
def dashboard_summary(db: Session = Depends(get_db)):
    total_sale = db.query(func.coalesce(func.sum(models.Invoice.total), 0)).scalar()
    total_paid = db.query(func.coalesce(func.sum(models.Invoice.paid), 0)).scalar()

   #Sirf jinka due > 0 hai unka hi jodo
    total_due = db.query(
        func.coalesce(func.sum(case((models.Invoice.due > 0, models.Invoice.due), else_=0)), 0)
    ).scalar()

    # Jyada dene walo ka alag se, isko Due me mat milao
    total_give = db.query(
        func.coalesce(func.sum(case((models.Invoice.due < 0, func.abs(models.Invoice.due)), else_=0)), 0)
    ).scalar()

    return {
        "total_sale": total_sale,
        "total_paid": total_paid,
        "total_due": total_due, 
        "total_give": total_give,
    }

@router.get("/dashboard/pending")
def pending_list(db: Session = Depends(get_db)):
    # Jin ka Due > 0 hai - matlab jinse paisa lena hai
    pending = db.query(models.Invoice).filter(models.Invoice.due > 0).order_by(models.Invoice.due.desc()).all()
    return [
        {
            "invoice_no": i.invoice_no,
            "naam": i.naam,
            "phone": i.phone,
            "product_name": i.product_name,
            "total": i.total,
            "paid": i.paid,
            "due": i.due,
            "payment_mode": i.payment_mode
        } for i in pending
    ]

@router.get("/dashboard/today")
def today_hisab(db: Session = Depends(get_db)):
    import datetime
    today = datetime.date.today()
    today_invoices = db.query(models.Invoice).filter(func.date(models.Invoice.created_at) == today).all()
    today_sale = sum(i.total for i in today_invoices)
    today_paid = sum(i.paid for i in today_invoices)
    return {
        "date": str(today),
        "aaj_ke_bills": len(today_invoices),
        "aaj_ki_sale": today_sale,
        "aaj_aaya_paisa": today_paid,
        "bills": [{"naam": i.naam, "product_name": i.product_name, "total": i.total, "due": i.due} for i in today_invoices]
    }

@router.post("/")
def create_invoice(data: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    # 1. PEHLE PRODUCT DHOONDO
    product = db.query(models.Product).filter(
        models.Product.name.ilike(data.product_name)
    ).first()

    if not product:
        raise HTTPException(404, f"{data.product_name} stock me hai hi nahi")

    # 2. STOCK CHECK KARO
    if product.stock < data.quantity:
        raise HTTPException(400, f"Stock kam hai! Bacha hua stock: {product.stock}")

    # 3. STOCK GHATAO - YAHI TERA MAIN KAAM HAI
    product.stock = product.stock - data.quantity

    # 4. AB BILL BANAO
    total = data.quantity * data.price
    due = total - data.paid

    if data.paid == 0:
        final_mode = "PENDING"
    elif due == 0:
        final_mode = data.payment_mode
    else:
        final_mode = "MIX"

    count = db.query(models.Invoice).count() + 1
    inv = models.Invoice(
        invoice_no=f"INV-{count:04d}",
        naam=data.naam,
        phone=data.phone,
        product_name=data.product_name,
        quantity=data.quantity,
        price=data.price,
        total=total,
        paid=data.paid,
        due=due,
        payment_mode=final_mode
        # created_at apne aap aa jayega - abhi ka time/date
    )
    db.add(inv)
    db.commit()
    db.refresh(inv)
    return {
        "msg": "Invoice Ban Gaya",
        "invoice_no": inv.invoice_no,
        "total": total,
        "paid": data.paid,
        "due": due,
        "payment_mode": final_mode,
        "due_stock": product.stock,
        "time": str(inv.created_at)
    }

# --- BAAD ME PAISA AAYA TO YE CHALEGA ---
@router.post("/{invoice_id}/pay")
def add_payment(invoice_id: int, amount: float, payment_mode: str, db: Session = Depends(get_db)):
    inv = db.query(models.Invoice).filter_by(id=invoice_id).first()
    if not inv:
        raise HTTPException(404, "Invoice nahi mila")
    
    inv.paid += amount
    inv.due = inv.total - inv.paid
    
    if inv.due <= 0:
        inv.due = 0
        inv.payment_mode = payment_mode  # Ab poora clear - CASH / UPI
    else:
        inv.payment_mode = "MIX"  # Abhi bhi baki hai

    db.commit()
    return {"msg": "Payment Add Ho Gaya", "naam": inv.naam, "paid": inv.paid, "due": inv.due, "payment_mode": inv.payment_mode}

@router.get("/")
def list_invoices(search: str = "", db: Session = Depends(get_db)):
    q = db.query(models.Invoice)
    if search:
        q = q.filter((models.Invoice.naam.ilike(f"%{search}%")) | (models.Invoice.phone.ilike(f"%{search}%")))
    return q.all()

@router.get("/{invoice_id}/pdf")
def invoice_pdf(invoice_id: int, db: Session = Depends(get_db)):
    inv = db.query(models.Invoice).filter_by(id=invoice_id).first()
    if not inv:
        raise HTTPException(404, "Invoice nahi mila")
    
    path = f"/tmp/invoice_{inv.invoice_no}.pdf"
    c = canvas.Canvas(path)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(180, 800, "HisabKitab")
    c.setFont("Helvetica", 12)
    c.drawString(50, 760, f"Invoice No: {inv.invoice_no}")
    c.drawString(50, 740, f"Naam: {inv.naam}")
    c.drawString(50, 720, f"Phone: {inv.phone}")
    c.drawString(50, 700, f"Product: {inv.product_name}")
    c.drawString(50, 680, f"Quantity: {inv.quantity} x Price: {inv.price}")
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, 640, f"Total: Rs. {inv.total}")
    c.drawString(50, 620, f"Paid: Rs. {inv.paid}")
    c.drawString(50, 600, f"Due: Rs. {inv.due}")
    c.drawString(50, 580, f"Payment Mode: {inv.payment_mode}")
    c.save()
    return FileResponse(path, media_type="application/pdf", filename=f"{inv.invoice_no}.pdf")


@router.get("/{invoice_id}")
def get_invoice(invoice_id: int, db: Session = Depends(get_db)):
    inv = db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return inv