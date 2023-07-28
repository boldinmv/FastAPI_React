from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from services import customer as CustomerService
from dto import customer as CustomerDTO

router = APIRouter()

@router.post('/', tags=["customer"])
async def create(data: CustomerDTO.Customer = None, db: Session = Depends(get_db)):
    return CustomerService.create_customer(data, db)

@router.get('/{id}', tags=["customer"])
async def get(id: int = None, db: Session = Depends(get_db)):
    return CustomerService.get_customer(id, db)

@router.get('s', tags=["customer"])
async def get(db: Session = Depends(get_db)):
    return CustomerService.get_customers(db)

@router.put('/{id}', tags=["customer"])
async def update(id: int = None, data:CustomerDTO.Customer = None, db: Session = Depends(get_db)):
    return CustomerService.update(data, db, id)

@router.delete('/{id}', tags=["customer"])
async def delete(id: int = None, db: Session = Depends(get_db)):
    return CustomerService.remove(db, id)