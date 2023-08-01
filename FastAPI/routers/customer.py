from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from services import customer as CustomerService
from dto import customer as CustomerDTO
import io
from PIL import Image
from fastapi.responses import StreamingResponse

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

@router.get('/photo/{filename}', tags=["customer"])
def thumbnail_image (filename: str):
    image = Image.open('./photos/customer/' + filename)
    rgb_image = image.convert('RGB')
    rgb_image.thumbnail((100, 100))
    imgio = io.BytesIO()
    rgb_image.save(imgio, 'JPEG')
    imgio.seek(0)
    return StreamingResponse(content=imgio, media_type="image/jpeg")