import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  NavDropdown,
  Row,
  Col,
} from "react-bootstrap";

const CustomNavbar = () => {
  const { cartItems } = useCart();

  return (
    <div className="navbar-section">
      {/* Top Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="px-4">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            Zapkart
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbar-nav" />

          <Navbar.Collapse id="navbar-nav">
            <Form className="d-flex mx-auto w-50">
              <FormControl
                type="search"
                placeholder="Search..."
                className="me-2"
              />
            </Form>

            <Nav className="ms-auto d-flex align-items-center gap-3">
              <div className="text-white">SignIn | SignUp</div>

              <Nav.Link as={Link} to="/cart" className="position-relative">
                Cart
                <span className="ms-1 fw-bold text-warning">
                  {cartItems.length}
                </span>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Submenu */}
      <div className="subMenu px-3 py-2 bg-secondary text-white">
        <Container>
          <Row className="justify-content-center">
            <Col xs="auto">
              <Nav className="gap-3 flex-wrap">
                <Nav.Link as={Link} to="/mobiles" className="text-white">
                  Mobiles
                </Nav.Link>
                <Nav.Link as={Link} to="/computers" className="text-white">
                  Computers
                </Nav.Link>
                <Nav.Link as={Link} to="/watch" className="text-white">
                  Watches
                </Nav.Link>
                <Nav.Link as={Link} to="/men" className="text-white">
                  Mens Wear
                </Nav.Link>
                <Nav.Link as={Link} to="/woman" className="text-white">
                  Woman Wear
                </Nav.Link>
                <Nav.Link as={Link} to="/furniture" className="text-white">
                  Furniture
                </Nav.Link>
                <Nav.Link as={Link} to="/kitchen" className="text-white">
                  Kitchen
                </Nav.Link>
                <Nav.Link as={Link} to="/fridge" className="text-white">
                  Fridge
                </Nav.Link>
                <Nav.Link as={Link} to="/" className="text-white">
                  Books
                </Nav.Link>
                <Nav.Link as={Link} to="/" className="text-white">
                  Speakers
                </Nav.Link>
                <Nav.Link as={Link} to="/" className="text-white">
                  TV's
                </Nav.Link>
                <Nav.Link as={Link} to="/ac" className="text-white">
                  AC
                </Nav.Link>
              </Nav>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default CustomNavbar;
