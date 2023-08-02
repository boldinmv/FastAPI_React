from sqlalchemy import Column, ForeignKey, Integer, Float, Date, DateTime
from sqlalchemy.sql import func
from database import Base
from sqlalchemy.orm import relationship

class Order(Base):
    __tablename__ = 'order'

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer)
    total = Column(Float)
    order_date = Column(Date)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    products = relationship("OrderProduct", back_populates="order")


class OrderProduct(Base):
    __tablename__ = 'order_product'

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer)
    quantity = Column(Integer)
    price = Column(Float)
    total = Column(Float)
    order_id = Column(Integer, ForeignKey("order.id"))
    
    order = relationship("Order", back_populates="products")