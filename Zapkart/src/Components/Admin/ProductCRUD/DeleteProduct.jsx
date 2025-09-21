import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import BASE_URL from "../../../config";

export default function DeleteProduct() {
  const [pid, setPid] = useState('');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState(''); // success or danger

  const deleteProduct = (e) => {
    e.preventDefault();

    if (!pid.trim()) {
      setMessage('Please enter a product ID.');
      setVariant('danger');
      return;
    }

    const token = JSON.parse(localStorage.getItem('token'));

    axios
      .delete(`${BASE_URL}/api/products/${pid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setMessage('Product deleted successfully!');
        setVariant('success');
        setPid('');
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
        setMessage('Failed to delete product. Please check the ID or try again.');
        setVariant('danger');
      });
  };

  return (
    <Container style={{ maxWidth: '500px', marginTop: '2rem' }}>
      <h3 className="mb-4">Delete Product</h3>
      <Form onSubmit={deleteProduct}>
        <Form.Group controlId="pid">
          <Form.Label>Product ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product ID"
            value={pid}
            onChange={(e) => setPid(e.target.value)}
          />
        </Form.Group>

        <Button variant="danger" type="submit" className="mt-3">
          Delete
        </Button>
      </Form>

      {message && (
        <Alert variant={variant} className="mt-3">
          {message}
        </Alert>
      )}
    </Container>
  );
}
