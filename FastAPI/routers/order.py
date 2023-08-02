from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from services import order as OrderService
from dto import order as OrderDTO

router = APIRouter()

@router.post('/', tags=["order"])
async def create(data: OrderDTO.Order = None, db: Session = Depends(get_db)):
    return OrderService.create_order(data, db)

@router.get('/{id}', tags=["order"])
async def get(id: int = None, db: Session = Depends(get_db)):
    return OrderService.get_order(id, db)

@router.get('s', tags=["order"])
async def get(db: Session = Depends(get_db)):
    return OrderService.get_orders(db)

@router.put('/{id}', tags=["order"])
async def update(id: int = None, data:OrderDTO.Order = None, db: Session = Depends(get_db)):
    return OrderService.update(data, db, id)

@router.delete('/{id}', tags=["order"])
async def delete(id: int = None, db: Session = Depends(get_db)):
    return OrderService.remove(db, id)