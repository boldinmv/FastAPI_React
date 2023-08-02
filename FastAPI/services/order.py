from models.product import Product
from models.order import Order
from models.order import OrderProduct
from models.customer import Customer
from sqlalchemy.orm import Session
from dto import order

def create_order(data: order.Order, db: Session):
    order = Order(customer_id=data.customer_id, order_date=data.order_date)
    try:
        order.total = 0
        for product in data.products:
            product_data = db.query(Product).filter(Product.id==product.product_id).first()
            order.total += product_data.price * product.quantity

        db.add(order)
        db.commit()
        db.refresh(order)

        for product in data.products:
            product_data = db.query(Product).filter(Product.id==product.product_id).first()
            order_product = OrderProduct(
                order_id = order.id,
                product_id = product.product_id,
                quantity = product.quantity,
                price = product_data.price,
                total = product_data.price * product.quantity
            )

            db.add(order_product)
            db.commit()
            db.refresh(order_product)

        db.refresh(order)

        order.products = db.query(OrderProduct).filter(OrderProduct.order_id==order.id).all()

    except Exception as e:
        print(e)
    return order

def get_order(id: int, db: Session):
    order = db.query(Order).filter(Order.id==id).first()
    order.products = db.query(OrderProduct).filter(OrderProduct.order_id==id).all()
    return order

def get_orders(db: Session):
    orders = db.query(Order).all()
    result = []
    for order in orders:
        customer = db.query(Customer).filter(Customer.id==order.customer_id).first()
        order.customer_name = customer.name
        order.products = db.query(OrderProduct).filter(OrderProduct.order_id==order.id).all()

        result.append(order)
    return result

def update(data: order.Order, db: Session, id: int):
    order = db.query(Order).filter(Order.id==id).first()
    order.customer_id = data.customer_id
    order.order_date = data.order_date

    order.total = 0
    for product in data.products:
        product_data = db.query(Product).filter(Product.id==product.product_id).first()
        order.total += product_data.price * product.quantity

    db.add(order)
    db.commit()

    db.query(OrderProduct).filter(OrderProduct.order_id==order.id).delete()

    for product in data.products:
        product_data = db.query(Product).filter(Product.id==product.product_id).first()
        order_product = OrderProduct(
            order_id = order.id,
            product_id = product.product_id,
            quantity = product.quantity,
            price = product_data.price,
            total = product_data.price * product.quantity
        )

        db.add(order_product)
        db.commit()
        db.refresh(order_product)

    db.add(order)
    db.commit()
    db.refresh(order)

    order.products = db.query(OrderProduct).filter(OrderProduct.order_id==order.id).all()

    return order

def remove(db: Session, id: int):
    order = db.query(Order).filter(Order.id==id).delete()
    db.commit()
    db.query(OrderProduct).filter(OrderProduct.order_id==id).delete()
    db.commit()
    return order