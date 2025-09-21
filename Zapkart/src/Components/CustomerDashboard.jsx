import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Navbar, Nav, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import BASE_URL from "../config";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    setResponseData(storedData);
  }, []);

  const logout = () => {
    localStorage.removeItem('userData');
    alert('Logout successful');
    navigate('/');
  };

  return (
    <Container fluid>
      <Row>
        <Navbar bg="dark" variant="dark" className="mb-3">
          <Navbar.Brand href="#home">ZapKart</Navbar.Brand>
          <Nav className="ms-auto">
            <Button variant="outline-light" onClick={logout}>Logout</Button>
          </Nav>
        </Navbar>
      </Row>

      <Row>
        <Col md={2} className="bg-light p-3">
          <h4>Dashboard</h4>
          <ListGroup>
            <ListGroup.Item action>Home</ListGroup.Item>
            <ListGroup.Item action>Orders</ListGroup.Item>
            <ListGroup.Item action>Profile</ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={10} className="p-4">
          <h1>Welcome Customer!</h1>
          {responseData && (
            <div>
              <h3>Response Data (From Local Storage):</h3>
              <pre>{JSON.stringify(responseData, null, 2)}</pre>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
