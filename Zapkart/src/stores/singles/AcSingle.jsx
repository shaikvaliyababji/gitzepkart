import React from "react";
import { acData } from "../data/ac";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';

import { useCart } from "../context/CartContext";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

const AcSingle = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const product = acData.find((item) => item.id === id);

  return (
    <>
    
      <Navbar />
      <Container className="my-5 d-flex justify-content-center">
        <Card className="p-4 shadow-lg rounded-4" style={{ maxWidth: "1000px", width: "100%" }}>
          <Row className="align-items-center g-4">
            <Col md={6}>
              {/* Add red border here */}
              <Card className="border border-danger rounded-3">
                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.model}
                  className="img-fluid rounded-3"
                  style={{ objectFit: "contain", maxHeight: "450px", width: "100%" }}
                />
              </Card>
            </Col>
            <Col md={6}>
              <h2 className="text-primary fw-bold">{product.company}</h2>
              <h4 className="mt-3">{product.model}</h4>
              <h4 className="text-success mt-2">₹{product.price}</h4>
              <p className="mt-4 text-secondary" style={{ lineHeight: "1.6" }}>
                {product.description}
              </p>
              <div className="d-flex gap-3 mt-4">
                <Button
                  variant="warning"
                  size="lg"
                  className="px-4 py-2 fw-semibold"
                  style={{ transition: "all 0.3s ease-in-out" }}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outline-secondary"
                  size="lg"
                  className="px-4 py-2"
                  onClick={() => navigate(-1)}
                >
                  ← Back
                </Button>
              </div>
            </Col>
          </Row>
        </Card>
       
      </Container>
    </>
  );
};

export default AcSingle;
