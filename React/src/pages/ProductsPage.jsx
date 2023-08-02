import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import React,  {useState, useEffect} from 'react';
import api from '../helpers/api';



function ProductsPage() {

  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: 0,
    price_wholesale: 0
  });

  const fetchProducts = async () => {
    const response = await api.get('/products');
    setProducts(response.data)
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value;

    setFormData({
      ...formData,
      [event.target.name]: value
    });
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    if (!formData.name) {
      alert('Введите название товара');
      return;
    }
    if (!formData.price) {
      alert('Введите цену продажи');
      return;
    }
    if (!formData.price_wholesale) {
      alert('Введите цену закупки');
      return;
    }

    if (formData.id) {
      await api.put('/product/'+formData.id, formData);
    } else {
      await api.post('/product/', formData);
    }
    
    fetchProducts();
    setFormData({
      id: '',
      name: '',
      price: 0,
      price_wholesale: 0
    })
    setShowModal(false);
  }

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const addProductForm = () => {
    setFormData({
      id: '',
      name: '',
      birthday: '',
      sex: 'm',
      photo: '',
      accept_pd: false
    });
    handleShowModal();
  }

  const editProductForm = async id => {
    if (!id) return;
    const response = await api.get('/product/'+id);
    setFormData(response.data);
    handleShowModal();
  }

  const deleteProductForm = async id => {
    if (!id) return;
    const confirmed = window.confirm('Вы действительно хотите удалить этот товар?');
    if (!confirmed) return;

    const deleteResponse = await api.delete('/product/'+id);
    if (deleteResponse?.data?.error) {
      alert(deleteResponse.data.error);
      return;
    }

    const response = await api.get('/products');
    setProducts(response.data);
  }

  return (
    <>
      <Modal
        show={showModal}
        onHide={handleShowModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Данные товара</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <FloatingLabel
              controlId="name"
              label="Введите название товара"
              className="mb-3"
            >
              <Form.Control
                name='name'
                type="text"
                placeholder="Введите название товара"
                value={formData.name}
                onChange={handleInputChange}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="price"
              label="Цена продажи"
              className="mb-3"
            >
              <Form.Control
                name='price'
                type="number"
                placeholder="Введите цену продажи"
                value={formData.price}
                onChange={handleInputChange}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="price_wholesale"
              label="Цена закупки"
              className="mb-3"
            >
              <Form.Control
                name='price_wholesale'
                type="number"
                placeholder="Введите цену закупки"
                value={formData.price_wholesale}
                onChange={handleInputChange}
              />
            </FloatingLabel>

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
          onClick={()=>addProductForm()}
        >
          Добавить товар
        </Button>
      </Container>

      <Container>
        <div className={`${products.length > 0 ? 'd-none' :''}`}>
          <h2 className='text-center'>Список товаров пуст</h2>
        </div>
        <div className={`${products.length == 0 ? 'd-none' :''}`}>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>№</th>
                <th>Название</th>
                <th>Цена продажи</th>
                <th>Цена закупки</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
              products.map((product, index) =>
                <tr key={product.id}>
                  <td>{index+1}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.price_wholesale}</td>
                  <td>
                    <div className='w-100 d-flex justify-content-around'>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => editProductForm(`${product.id}`)}
                      >
                        Изменить
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteProductForm(`${product.id}`)}
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

export default ProductsPage;