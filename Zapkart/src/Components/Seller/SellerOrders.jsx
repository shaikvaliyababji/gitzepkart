import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from "../../config";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sellerId = JSON.parse(localStorage.getItem('userData'))?.id;
  const token = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    const fetchSellerOrders = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/orders/${sellerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching seller orders:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    if (sellerId && token) {
      fetchSellerOrders();
    } else {
      setError('Seller not logged in');
      setLoading(false);
    }
  }, [sellerId, token]);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4">
      <h2>Seller Orders</h2>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Order Date</th>
            <th>Razorpay Order ID</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer?.name}</td>
                <td>{order.product?.name}</td>
                <td>{order.quantity}</td>
                <td>{new Date(order.orderDate).toLocaleString()}</td>
                <td>{order.razorpayOrderId}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No orders found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
