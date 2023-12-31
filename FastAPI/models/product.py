from sqlalchemy import Column, Integer, String, Float
from database import Base

class Product(Base):
    __tablename__ = 'product'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    price = Column(Float)
    price_wholesale = Column(Float)