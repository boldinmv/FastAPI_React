from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from services import report as ReportService

router = APIRouter()

@router.get('/', tags=["report"])
async def get(start: str, end: str, db: Session = Depends(get_db)):
    return ReportService.get_report(start, end, db)