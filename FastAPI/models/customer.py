from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime
from sqlalchemy.sql import func
from database import Base

class Customer(Base):
    __tablename__ = 'customer'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    birthday = Column(Date)
    sex = Column(String)
    photo = Column(String)
    accept_pd = Column(Boolean)
    created_at = Column(DateTime(timezone=True), server_default=func.now())