import { Form, Button } from 'react-bootstrap';
import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from "../../../config";

export default function UpdateProduct() {
  const [updateProductData, setUpdateProductData] = useState({
    id: '',
    field: '',
    value: ''
  });

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem('token'));
  
    // Build the update object dynamically
    const productUpdate = {};
    productUpdate[updateProductData.field] = updateProductData.value;
  
    axios.put(`${BASE_URL}/api/products/${updateProductData.id}`, productUpdate, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      alert('Product updated successfully!');
      console.log(response.data);
    })
    .catch((error) => {
      console.error('Error updating product:', error);
    });
  };
  

  return (
    <div>
      <h3>Update Product</h3>
      <Form onSubmit={handleUpdateSubmit}>
        <Form.Group>
          <Form.Label>Product ID</Form.Label>
          <Form.Control type="text" name="id" value={updateProductData.id} onChange={handleUpdateChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Select Field to Update</Form.Label>
          <Form.Control as="select" name="field" value={updateProductData.field} onChange={handleUpdateChange}>
            <option value="name">Product Name</option>
            <option value="price">Product Cost</option>
            <option value="stock">Product Stock</option>
            <option value="seller_id">Seller Details</option>
            <option value="description">Product Description</option>
            <option value="Category">Product Category</option>
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Enter New Value</Form.Label>
          <Form.Control type="text" name="value" value={updateProductData.value} onChange={handleUpdateChange} required />
        </Form.Group>
        <Button variant="primary" type="submit">Update Product</Button>
      </Form>
    </div>
  );
}
