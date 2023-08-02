import moment from 'moment';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import React,  {useState, useEffect} from 'react';
import api from '../helpers/api';


function ReportsPage() {
  const [dateStart, setDateStart] = useState(moment().startOf('month').format('YYYY-MM-DD'));
  const [dateEnd, setDateEnd] = useState(moment().format('YYYY-MM-DD'));
  const [reports, setReports] = useState([]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const response = await api.get(`/report/?start=${dateStart}&end=${dateEnd}`);
    setReports(response.data)
  }

  return (
    <>
      <Container className="mb-3">
        <Form
          encType="multipart/form-data"
          onSubmit={handleFormSubmit}
        >
          <Row>
            <Col>
                <FloatingLabel
                  controlId="dateStart"
                  label="Дата с"
                  className="mb-3"
                  >
                  <Form.Control
                      name='dateStart'
                      type="date"
                      placeholder="Дата с"
                      value={dateStart}
                      onChange={e => setDateStart(e.target.value)}
                  />
              </FloatingLabel>
            </Col>
            <Col>
                <FloatingLabel
                  controlId="dateEnd"
                  label="Дата по"
                  className="mb-3"
                  >
                  <Form.Control
                      name='dateEnd'
                      type="date"
                      placeholder="Дата по"
                      value={dateEnd}
                      onChange={e => setDateEnd(e.target.value)}
                  />
              </FloatingLabel>
            </Col>
            <Col>
              <Button variant="primary" type="submit">
                Показать отчёт
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>

      <Container>
        <div className={`${reports.length > 0 ? 'd-none' :''}`}>
          <h2 className='text-center'>Отчёт пуст</h2>
        </div>
        <div className={`${reports.length == 0 ? 'd-none' :''}`}>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>№</th>
                <th>Покупатель</th>
                <th>Итого за период</th>
              </tr>
            </thead>
            <tbody>
              {
              reports.map((report, index) =>
                <tr key={report.customer_id}>
                  <td>{index+1}</td>
                  <td>{report.customer_name}</td>
                  <td>{report.total}</td>
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

export default ReportsPage;