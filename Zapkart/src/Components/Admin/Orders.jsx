import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from "../../config";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const response = await axios.get(`${BASE_URL}/api/orders/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Fetched Orders:', response.data);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <div key={order.orderId} className="border rounded p-4 shadow">
            <h2 className="text-xl font-semibold">Order ID: {order.orderId}</h2>
            <p>Customer ID: {order.customer?.id}</p>
            <p>Customer Name: {order.customer?.name}</p>
            <p>Product: {order.product?.name}</p>
            <p>Total Amount: ₹{order.price}</p>
            <p>Status: {order.status}</p>
            <p>Order Date: {new Date(order.orderDate).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
