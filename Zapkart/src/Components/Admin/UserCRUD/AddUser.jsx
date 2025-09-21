import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import BASE_URL from "../../../config";

export default function AddUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const registerUser = (e) => {
    e.preventDefault();

    const payload = new FormData();
    for (let key in formData) {
      payload.append(key, formData[key]);
    }
    if (image) {
      payload.append('image', image);
    }

    

    axios
      .post(`${BASE_URL}/api/users/register`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data'       
        },
      })
      .then((response) => {
        localStorage.setItem('userData', JSON.stringify(response.data));
        setMessage('User registered successfully!');
        setVariant('success');

        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          role: '',
        });
        setImage(null);
      })
      .catch((error) => {
        console.error(error);
        setMessage('Registration failed. Please try again.');
        setVariant('danger');
      });
  };

  return (
    <Container style={{ maxWidth: '500px', marginTop: '2rem' }}>
      <h3 className="mb-4">Add New User</h3>
      <Form onSubmit={registerUser} encType="multipart/form-data">
        <Form.Group className="mb-3" controlId="reg-name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="reg-email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="reg-password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="reg-role">
          <Form.Label>Role</Form.Label>
          <Form.Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Role --</option>
            <option value="ADMIN">Admin</option>
            <option value="SELLER">Seller</option>
            <option value="CUSTOMER">Customer</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Profile Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </Form.Group>

        <Button variant="outline-primary" size="lg" className="rounded-pill px-4" type="submit">
          Register User
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
