from models.customer import Customer
from sqlalchemy.orm import Session
from dto import customer

def create_customer(data: customer.Customer, db: Session):
    customer = Customer(name=data.name, birthday=data.birthday, sex=data.sex, photo=data.photo, accept_pd=data.accept_pd)
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
    return db.query(Customer).all()

def update(data: customer.Customer, db: Session, id: int):
    customer = db.query(Customer).filter(Customer.id==id).first()
    customer.name = data.name
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer

def remove(db: Session, id: int):
    customer = db.query(Customer).filter(Customer.id==id).delete()
    db.commit()
    return customer