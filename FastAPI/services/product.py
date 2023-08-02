from models.product import Product
from models.order import OrderProduct
from sqlalchemy.orm import Session
from dto import product

def create_product(data: product.Product, db: Session):
    product = Product(name=data.name, price=data.price, price_wholesale=data.price_wholesale)
    try:
        db.add(product)
        db.commit()
        db.refresh(product)
    except Exception as e:
        print(e)
    return product

def get_product(id: int, db: Session):
    return db.query(Product).filter(Product.id==id).first()

def get_products(db: Session):
    return db.query(Product).all()

def update(data: product.Product, db: Session, id: int):
    product = db.query(Product).filter(Product.id==id).first()
    product.name = data.name
    product.price = data.price
    product.price_wholesale = data.price_wholesale
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

def remove(db: Session, id: int):
    order = db.query(OrderProduct).filter(
        OrderProduct.product_id == id
    ).first()

    print(order)

    if (order):
        return {'error':'Нельзя удалить этот товар, т.к. с ним есть оформленный заказ. Для удаления этого товара сначала удалите все содержащие его заказы.'}

    product = db.query(Product).filter(Product.id==id).delete()
    db.commit()
    return product