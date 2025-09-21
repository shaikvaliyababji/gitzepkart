import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import BASE_URL from "../../../config";

export default function DeleteUser() {
  const [uid, setUid] = useState('');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState(''); // 'success' or 'danger'

  const deleteUser = (e) => {
    e.preventDefault();

    if (!uid.trim()) {
      setMessage('Please enter a user ID.');
      setVariant('danger');
      return;
    }

    const token = JSON.parse(localStorage.getItem('token'));

    axios
      .delete(`${BASE_URL}/api/users/${uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setMessage('User deleted successfully!');
        setVariant('success');
        setUid('');
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
        setMessage('Failed to delete user. Please check the ID or try again.');
        setVariant('danger');
      });
  };

  return (
    <Container style={{ maxWidth: '500px', marginTop: '2rem' }}>
      <h3 className="mb-4">Delete User</h3>
      <Form onSubmit={deleteUser}>
        <Form.Group controlId="uid">
          <Form.Label>User ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter user ID"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
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
