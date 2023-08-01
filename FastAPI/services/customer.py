from models.customer import Customer
from sqlalchemy.orm import Session
from dto import customer
import datetime
import base64

def create_customer(data: customer.Customer, db: Session):
    photo = 'no_photo.jpg'
    if (data.photo):
        file_type = data.photo.split("data:image/",1)[1].split(";base64,",1)[0]
        if (file_type):
            photo = datetime.datetime.now().strftime("%Y%d%m%H%M%S") + '.' + file_type
            with open('./photos/customer/'+photo, "wb") as fh:
                fh.write(base64.b64decode(data.photo.split(";base64,",1)[1]))

    customer = Customer(name=data.name, birthday=data.birthday, sex=data.sex, photo=photo, accept_pd=data.accept_pd)
    try:
        db.add(customer)
        db.commit()
        db.refresh(customer)
    except Exception as e:
        print(e)
    return customer

def get_customer(id: int, db: Session):
    return db.query(Customer).filter(Customer.id==id).first()

def get_customers(db: Session):
    return db.query(Customer).order_by(Customer.name).all()

def update(data: customer.Customer, db: Session, id: int):
    customer = db.query(Customer).filter(Customer.id==id).first()
    if (customer.photo != data.photo):
        photo = 'no_photo.jpg'
        if (data.photo):
            file_type = data.photo.split("data:image/",1)[1].split(";base64,",1)[0]
            if (file_type):
                photo = datetime.datetime.now().strftime("%Y%d%m%H%M%S") + '.' + file_type
                with open('./photos/customer/'+photo, "wb") as fh:
                    fh.write(base64.b64decode(data.photo.split(";base64,",1)[1]))
    customer.name = data.name
    customer.birthday = data.birthday
    customer.sex = data.sex
    if (customer.photo != data.photo):
        customer.photo = photo
    customer.accept_pd = data.accept_pd
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer

def remove(db: Session, id: int):
    customer = db.query(Customer).filter(Customer.id==id).delete()
    db.commit()
    return customer