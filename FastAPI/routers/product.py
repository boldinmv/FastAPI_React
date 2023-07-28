from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from services import product as ProductService
from dto import product as ProductDTO

router = APIRouter()

@router.post('/', tags=["product"])
async def create(data: ProductDTO.Product = None, db: Session = Depends(get_db)):
    return ProductService.create_product(data, db)

@router.get('/{id}', tags=["product"])
async def get(id: int = None, db: Session = Depends(get_db)):
    return ProductService.get_product(id, db)

@router.get('s', tags=["product"])
async def get(db: Session = Depends(get_db)):
    return ProductService.get_products(db)

@router.put('/{id}', tags=["product"])
async def update(id: int = None, data:ProductDTO.Product = None, db: Session = Depends(get_db)):
    return ProductService.update(data, db, id)

@router.delete('/{id}', tags=["product"])
async def delete(id: int = None, db: Session = Depends(get_db)):
    return ProductService.remove(db, id)