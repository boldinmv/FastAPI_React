import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';
import React,  {useState, useEffect} from 'react';
import api from '../helpers/api';


function CustomersPage() {

  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    birthday: '',
    sex: 'm',
    photo: '',
    accept_pd: false
  });

  const fetchCustomers = async () => {
    const response = await api.get('/customers');
    setCustomers(response.data)
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.type == 'checkbox'
      ? event.target.checked
      : event.target.value

    setFormData({
      ...formData,
      [event.target.name]: value
    });
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (formData.id) {
      await api.put('/customer/'+formData.id, formData);
    } else {
      await api.post('/customer/', formData);
    }
    
    fetchCustomers();
    setFormData({
      id: '',
      name: '',
      birthday: '',
      sex: 'm',
      photo: '',
      accept_pd: false
    })
    document.getElementById('file').value = '';
    setShowModal(false);
  }

  const handleFileRead = async (event) => {
    const file = event.target.files[0]
    const base64 = await convertBase64(file)
    setFormData({
      ...formData,
      photo: base64
    });
  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    })
  }

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const addCustomerForm = () => {
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

  const editCustomerForm = async id => {
    if (!id) return;
    const response = await api.get('/customer/'+id);
    setFormData(response.data);
    handleShowModal();
  }

  const deleteCustomerForm = async id => {
    if (!id) return;
    const confirmed = window.confirm('Вы действительно хотите удалить этого покупателя?');
    if (!confirmed) return;
    await api.delete('/customer/'+id);
    const response = await api.get('/customers');
    setCustomers(response.data);
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
          <Modal.Title>Данные покупателя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            encType="multipart/form-data"
            onSubmit={handleFormSubmit}
          >
            <FloatingLabel
              controlId="name"
              label="Введите ФИО покупателя"
              className="mb-3"
            >
              <Form.Control
                name='name'
                type="text"
                placeholder="Введите ФИО покупателя"
                value={formData.name}
                onChange={handleInputChange}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="birthday"
              label="Дата рождения покупателя"
              className="mb-3"
            >
              <Form.Control
                name='birthday'
                type="date"
                placeholder="Введите дату рождения покупателя"
                value={formData.birthday}
                onChange={handleInputChange}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="sex"
              label="Укажите пол покупателя"
            >
              <Form.Select
                name='sex'
                aria-label="Укажите пол покупателя"
                value={formData.sex}
                onChange={handleInputChange}
              >
                <option value="m">Мужчина</option>
                <option value="f">Женщина</option>
              </Form.Select>
            </FloatingLabel>

            <Form.Group controlId="file" className="mt-3 mb-3">
              <Form.Label className="ms-2">Фото покупателя:</Form.Label>
              <Form.Control
                name='file'
                type="file"
                size="lg"
                onChange={e => handleFileRead(e)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="accept_pd">
              <Form.Check
                name='accept_pd'
                type="checkbox"
                label="Согласен на обработку ПД"
                checked={formData.accept_pd}
                onChange={handleInputChange}
              />
            </Form.Group>

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
          onClick={()=>addCustomerForm()}
        >
          Добавить покупателя
        </Button>
      </Container>

      <Container>
        <div className={`${customers.length > 0 ? 'd-none' :''}`}>
          <h2 className='text-center'>Список покупателей пуст</h2>
        </div>
        <div className={`${customers.length == 0 ? 'd-none' :''}`}>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>№</th>
                <th>Фото</th>
                <th>ФИО</th>
                <th>Дата рождения</th>
                <th>Пол</th>
                <th>Согласие (ПД)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
              customers.map((customer, index) =>
                <tr key={customer.id}>
                  <td>{index+1}</td>
                  <td className='text-center'>
                    <Image
                      src={'http://127.0.0.1:8000/customer/photo/'+customer.photo}
                      thumbnail
                    />
                  </td>
                  <td>{customer.name}</td>
                  <td>{customer.birthday}</td>
                  <td>
                    {customer.sex == 'm' ? 'Мужчина' : ''}
                    {customer.sex == 'f' ? 'Женщина' : ''}
                  </td>
                  <td>{customer.accept_pd ? 'Да' : 'Нет'}</td>
                  <td>
                    <div className='w-100 d-flex justify-content-around'>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => editCustomerForm(`${customer.id}`)}
                      >
                        Изменить
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteCustomerForm(`${customer.id}`)}
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

export default CustomersPage;