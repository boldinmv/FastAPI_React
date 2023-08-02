import { Routes, Route } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap'
import Container from 'react-bootstrap/Container';

import CustomersPage from '../pages/CustomersPage'
import ProductsPage from '../pages/ProductsPage'
import OrdersPage from '../pages/OrdersPage'
import ReportsPage from '../pages/ReportsPage'

function Navigation() {
  return (
    <>
      <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="mb-5">
        <Container fluid>
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <LinkContainer to="/">
                  <Nav.Link>Покупатели</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/products">
                  <Nav.Link>Товары</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/orders">
                  <Nav.Link>Заказы</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/reports">
                  <Nav.Link>Отчёт</Nav.Link>
                </LinkContainer>
              </Nav>
          </Navbar.Collapse>
          <Navbar.Brand href="https://github.com/boldinmv/FastAPI_React" target="_blank">FastAPI + React</Navbar.Brand>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={<CustomersPage />}/>
        <Route path="/products" element={<ProductsPage />}/>
        <Route path="/orders" element={<OrdersPage />}/>
        <Route path="/reports" element={<ReportsPage />}/>
      </Routes>
    </>
  )
}

export default Navigation;