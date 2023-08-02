from models.order import Order
from models.customer import Customer
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from sqlalchemy import desc

def get_report(start: str, end: str, db: Session):
    result = db.query(
        Order.customer_id,
        func.sum(Order.total).label('total')
    ).filter(
        Customer.id == Order.customer_id
    ).filter(
        Order.order_date >= start,
        Order.order_date <= end
    ).order_by(
        desc('total')
    ).group_by(Order.customer_id)

    response = []
    for key, value in result:
        customer = db.query(Customer).filter(Customer.id==key).first()
        temp = {
            'customer_id' : key,
            'customer_name' : customer.name,
            'total': value
        }
        response.append(temp)

    return response