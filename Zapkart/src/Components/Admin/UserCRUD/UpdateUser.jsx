import { Form, Button } from 'react-bootstrap';
import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from "../../../config";

export default function UpdateUser() {
  const [updateUserData, setUpdateUserData] = useState({
    id: '',
    field: '',
    value: ''
  });

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem('token'));

    // Build update object dynamically
    const userUpdate = {};
    userUpdate[updateUserData.field] = updateUserData.value;

    axios.put(`${BASE_URL}/api/users/${updateUserData.id}`, userUpdate, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      alert('User updated successfully!');
      console.log(response.data);
    })
    .catch((error) => {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    });
  };

  return (
    <div>
      <h3>Update User</h3>
      <Form onSubmit={handleUpdateSubmit}>
        <Form.Group>
          <Form.Label>User ID</Form.Label>
          <Form.Control
            type="text"
            name="id"
            value={updateUserData.id}
            onChange={handleUpdateChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Select Field to Update</Form.Label>
          <Form.Control
            as="select"
            name="field"
            value={updateUserData.field}
            onChange={handleUpdateChange}
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="password">Password</option>
            <option value="role">Role</option>
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Enter New Value</Form.Label>
          <Form.Control
            type="text"
            name="value"
            value={updateUserData.value}
            onChange={handleUpdateChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Update User
        </Button>
      </Form>
    </div>
  );
}
