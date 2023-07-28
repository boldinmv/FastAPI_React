import datetime
from pydantic import BaseModel

class Customer(BaseModel):
    name: str
    birthday: datetime.date
    sex: str
    photo: str
    accept_pd: bool