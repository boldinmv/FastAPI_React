import { Routes, Route } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap'
import Container from 'react-bootstrap/Container';

import CustomersPage from '../pages/CustomersPage'

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
              </Nav>
          </Navbar.Collapse>
          <Navbar.Brand href="https://github.com/boldinmv/FastAPI_React" target="_blank">FastAPI + React</Navbar.Brand>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={<CustomersPage />}/>
      </Routes>
    </>
  )
}

export default Navigation;