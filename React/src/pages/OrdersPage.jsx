import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import React,  {useState, useEffect} from 'react';
import api from '../helpers/api';


function OrdersPage() {

  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    customer_id: '',
    order_date: '',
    products: []
  });

  const fetchOrders = async () => {
    const response = await api.get('/orders');
    setOrders(response.data)
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value;

    setFormData({
      ...formData,
      [event.target.name]: value
    });
  }

  const handleQuantityChange = (e, index) => {
    formData.products[index].quantity = e.target.value
    formData.products[index].total =  formData.products[index].price * formData.products[index].quantity
    setFormData({
      ...formData
    });
  }

  const removeProductFromOrder = (index) => {
    formData.products.splice(index,1);
    setFormData({
      ...formData
    });
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!formData.customer_id) {
      alert('Укажите покупателя');
      return;
    }
    if (!formData.order_date) {
      alert('Укажите дату заказа');
      return;
    }
    if (formData.products.length == 0) {
      alert('Добавьте товары');
      return;
    }

    for (let i in formData.products) {
      if (!formData.products[i].quantity) {
        alert('Укажите количество товаров');
        return;
      }
    }

    if (formData.id) {
      await api.put('/order/'+formData.id, formData);
    } else {
      await api.post('/order/', formData);
    }
    
    fetchOrders();
    setFormData({
      id: '',
      customer_id: '',
      order_date: '',
      products: []
    })
    setShowModal(false);
  }

  

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const addOrderForm = async () => {
    const customersResponse = await api.get('/customers');
    setCustomers(customersResponse.data)

    const productsResponse = await api.get('/products');
    setProducts(productsResponse.data)
    if (productsResponse.data[0]) setProduct(productsResponse.data[0]);

    setFormData({
      id: '',
      customer_id: customersResponse.data[0].id,
      order_date: '',
      products: []
    });
    handleShowModal();
  }

  const editOrderForm = async id => {
    if (!id) return;
    const orderResponse = await api.get('/order/'+id);
    setFormData(orderResponse.data);
    
    const customersResponse = await api.get('/customers');
    setCustomers(customersResponse.data)

    const productsResponse = await api.get('/products');
    setProducts(productsResponse.data)
    if (productsResponse.data[0]) setProduct(productsResponse.data[0]);

    handleShowModal();
  }

  const deleteOrderForm = async id => {
    if (!id) return;
    const confirmed = window.confirm('Вы действительно хотите удалить этот заказ?');
    if (!confirmed) return;
    await api.delete('/order/'+id);
    const response = await api.get('/orders');
    setOrders(response.data);
  }

  const changeProductHandler = (index) => {
    setProduct(products[index]);
  }

  const addProduct = () => {
    for (let i in formData.products) {
      if (product.id === formData.products[i].id) return;
    }
    product.product_id = product.id;
    product.quantity = 0;
    product.total = 0;
    formData.products.push(product);
    setFormData({
      ...formData
    });
  }



  return (
    <>
      <Modal
        show={showModal}
        onHide={handleShowModal}
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Данные заказа</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <FloatingLabel
              controlId="customer_id"
              label="Укажите покупателя"
              className="mb-3"
            >
              <Form.Select
                name='customer_id'
                aria-label="Укажите покупателя"
                value={formData.customer_id}
                onChange={handleInputChange}
              >
                {
                  customers.map(customer =>
                  <option value={customer.id} key={customer.id}>{customer.name}</option>
                  )
                }
              </Form.Select>
            </FloatingLabel>

            <FloatingLabel
              controlId="order_date"
              label="Дата заказа"
              className="mb-3"
            >
              <Form.Control
                name='order_date'
                type="date"
                placeholder="Введите дату заказа"
                value={formData.order_date}
                onChange={handleInputChange}
              />
            </FloatingLabel>

            <hr/>

            <Row>
              <Col>
                <FloatingLabel
                  controlId="product"
                  label="Выберите товар"
                  className="mb-3"
                >
                  <Form.Select
                    aria-label="Выберите товар"
                    onChange={event => changeProductHandler(event.target.value)}
                  >
                    {
                      products.map((product, index) =>
                        <option value={index} key={product.id}>{product.name}</option>
                      )
                    }
                  </Form.Select>
                </FloatingLabel>
              </Col>
              <Col xs="auto">
                <Button variant="success" onClick={addProduct}>
                  Добавить
                </Button>
              </Col>
            </Row>

            {
              formData.products.length == 0 ? (<></>) : (
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>№</th>
                      <th>Товар</th>
                      <th>Цена</th>
                      <th>Количество</th>
                      <th>Итого</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      formData.products.map((product, index) =>
                        <tr key={product.id}>
                          <td>{index+1}</td>
                          <td>{product.name}</td>
                          <td>{product.price}</td>
                          <td>
                            <Form.Control
                              type="number"
                              name="quantity"
                              value={product.quantity}
                              placeholder="Количество"
                              onChange={e => handleQuantityChange(e, index)}
                            />
                            </td>
                          <td>{product.total}</td>
                          <td className='text-center'>
                            <Button variant="danger" onClick={e => removeProductFromOrder(index)}>
                              Удалить
                            </Button>
                          </td>
                        </tr>
                      )
                    }
                  </tbody>
                </Table>
              ) 
            }

            <Stack direction="horizontal" gap={3} className="justify-content-end mt-3">
              <Button variant="secondary" onClick={handleCloseModal}>
                Отмена
              </Button>
              <Button variant="primary" type="submit">
                Сохранить
              </Button>
            </Stack>
          </Form>
        </Modal.Body>
      </Modal>

      <Container className="mb-3 text-end">
        <Button
          variant="primary"
          onClick={()=>addOrderForm()}
        >
          Добавить заказ
        </Button>
      </Container>

      <Container>
        <div className={`${orders.length > 0 ? 'd-none' :''}`}>
          <h2 className='text-center'>Список товаров пуст</h2>
        </div>
        <div className={`${orders.length == 0 ? 'd-none' :''}`}>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>№</th>
                <th>Покупатель</th>
                <th>Дата продажи</th>
                <th>Дата создания заказа</th>
                <th>Сумма</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
              orders.map((order, index) =>
                <tr key={order.id}>
                  <td>{index+1}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.order_date}</td>
                  <td>{order.created_at.replace('T', ' ')}</td>
                  <td>{order.total}</td>
                  <td>
                    <div className='w-100 d-flex justify-content-around'>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => editOrderForm(`${order.id}`)}
                      >
                        Изменить
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteOrderForm(`${order.id}`)}
                      >
                        Удалить
                      </Button>
                    </div>
                  </td>
                </tr>
              )
              }
            </tbody>
          </Table>
        </div>
      </Container>
    </>
  )
}

export default OrdersPage;