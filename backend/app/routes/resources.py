from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.resource import Resource
from app.schemas.common import ResourceResponse

router = APIRouter(prefix="/api/resources", tags=["Resources"])

@router.get("", response_model=List[ResourceResponse])
def get_resources(category: Optional[str] = None, db: Session = Depends(get_db)):
    """List available relief resources."""
    query = db.query(Resource)
    if category:
        query = query.filter(Resource.category == category.upper())
    return query.all()

@router.post("/allocate")
def allocate_resources(
    item_id: int = Body(...),
    quantity: int = Body(...),
    db: Session = Depends(get_db)
):
    """Deduct allocated resources from state inventory."""
    res = db.query(Resource).filter(Resource.id == item_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
    if res.available_stock < quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock available")

    res.available_stock -= quantity
    db.commit()
    db.refresh(res)
    return {"message": f"Allocated {quantity} {res.unit} of {res.item_name}", "remaining": res.available_stock}
