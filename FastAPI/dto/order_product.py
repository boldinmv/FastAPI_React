from pydantic import BaseModel

class OrderProduct(BaseModel):
    product_id: int
    quantity: int