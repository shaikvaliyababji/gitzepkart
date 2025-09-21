import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';
import BASE_URL from "../../../config";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    type: '',
    brand: '',
    model: '',
    sellerId: '',
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = new FormData();
    for (let key in formData) {
      payload.append(key, formData[key]);
    }
    if (image) {
      payload.append('image', image);
    }

    const token = JSON.parse(localStorage.getItem('token'));

    axios.post(`${BASE_URL}/api/products/saveData`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      alert('Product added successfully!');
      console.log(response.data);
    })
    .catch((error) => {
      console.error('Error adding product:', error);
      alert('Failed to add product.');
    });
  };

  return (
    <Container className="mt-4">
      <h2>Add New Product</h2>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Stock</Form.Label>
          <Form.Control type="number" name="stock" value={formData.stock} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control type="text" name="category" value={formData.category} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Control type="text" name="type" value={formData.type} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Brand</Form.Label>
          <Form.Control type="text" name="brand" value={formData.brand} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Model</Form.Label>
          <Form.Control type="text" name="model" value={formData.model} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Seller ID</Form.Label>
          <Form.Control type="number" name="sellerId" value={formData.sellerId} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Product Image</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImageChange} required />
        </Form.Group>

        <Button variant="primary" type="submit">Add Product</Button>
      </Form>
    </Container>
  );
};

export default AddProduct;
