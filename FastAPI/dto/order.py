import datetime
from pydantic import BaseModel
from dto import order_product

class Order(BaseModel):
    customer_id: int
    order_date: datetime.date
    products: list[order_product.OrderProduct]