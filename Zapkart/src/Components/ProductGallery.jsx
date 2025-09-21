import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
import BASE_URL from "../config";

const ProductGallery = () => {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    
    axios.get(`${BASE_URL}/api/products`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setProducts(res.data))
    .catch(err => console.error(err));
  }, []);
  

  const handleClose = () => setShow(false);
  const handleShow = (product) => {
    setSelected(product);
    setShow(true);
  };

  return (
    <Container className="mt-4">
      <Row xs={1} md={2} lg={4} className="g-4">
        {products.map(product => (
          <Col key={product.id}>
            <Card onClick={() => handleShow(product)} style={{ cursor: 'pointer' }}>
              <Card.Img
                variant="top"
                src={`${BASE_URL}/images/${product.profileImage}`}
                height="200"
                style={{ objectFit: 'cover' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Product Detail Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selected?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={`${BASE_URL}/images/${selected?.profileImage}`}
            alt={selected?.name}
            className="img-fluid mb-3"
          />
          <p><strong>Description:</strong> {selected?.description}</p>
          <p><strong>Brand:</strong> {selected?.brand}</p>
          <p><strong>Model:</strong> {selected?.model}</p>
          <p><strong>Category:</strong> {selected?.category}</p>
          <p><strong>Type:</strong> {selected?.type}</p>
          <p><strong>Price:</strong> ₹{selected?.price}</p>
          <p><strong>Stock:</strong> {selected?.stock}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductGallery;
