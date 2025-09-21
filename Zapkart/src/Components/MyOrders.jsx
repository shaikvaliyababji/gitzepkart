import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomNavbar from './CustomNavbar';
import Footer from './Footer';
import { Modal, Button, ProgressBar } from 'react-bootstrap';
import BASE_URL from "../config";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTracker, setShowTracker] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const userData = JSON.parse(localStorage.getItem('userData'));
      console.log("Token:", token);
      console.log("UserData:", userData);

      if (!token || !userData) {
        setError('User not logged in!');
        setLoading(false);
        return;
      }

      const customerId = userData.id;

      const response = await axios.get(`${BASE_URL}/api/orders/customer/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);
  
  const downloadInvoice = async (razorpayOrderId) => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const response = await axios.get(
        `${BASE_URL}/invoice/download/razorpay/${razorpayOrderId}`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `invoice_${razorpayOrderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download invoice:', error);
      alert('Failed to download invoice. Please try again.');
    }
  };


  const imageBaseUrl = `${BASE_URL}/images/`;

  const calculateDynamicStatus = (orderDate) => {
    const now = new Date();
    const placed = new Date(orderDate);
    const diffDays = Math.floor((now - placed) / (1000 * 60 * 60 * 24));

    if (diffDays >= 6) return 'Delivered';
    if (diffDays >= 4) return 'Out for Delivery';
    if (diffDays >= 2) return 'Shipped';
    return 'Confirmed';
  };

  const statusProgress = {
    Confirmed: 25,
    Shipped: 50,
    "Out for Delivery": 75,
    Delivered: 100,
  };

  const openTracker = (order) => {
    setCurrentOrder(order);
    setShowTracker(true);
  };

  const closeTracker = () => {
    setShowTracker(false);
    setCurrentOrder(null);
  };

  // ✅ Grouping orders by razorpayOrderId
  const groupOrdersByRazorpayOrderId = (orders) => {
    return orders.reduce((acc, order) => {
      const key = order.razorpayOrderId || 'Ungrouped';
      if (!acc[key]) acc[key] = [];
      acc[key].push(order);
      return acc;
    }, {});
  };

  const groupedOrders = groupOrdersByRazorpayOrderId(orders);

  return (
    <>
      <CustomNavbar />

      <div className="container my-5">
        <h2 className="text-center mb-4">My Orders</h2>

        {loading ? (
          <p className="text-center">Loading orders...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-center">No orders found.</p>
        ) : (
          Object.entries(groupedOrders).map(([razorpayOrderId, group]) => (
            <div key={razorpayOrderId} className="card shadow p-3 mb-4">
              <h5 className="mb-3">Order Group: {razorpayOrderId}</h5>
              {group.map((order) => {
                const dynamicStatus = calculateDynamicStatus(order.orderDate);
                return (
                  <div key={order.orderId} className="d-flex align-items-center mb-3">
                    <div style={{ width: '120px', height: '120px', flexShrink: 0 }}>
                      <img
                        src={`${imageBaseUrl}${order.product?.profileImage}`}
                        alt={order.product?.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '10px',
                        }}
                      />
                    </div>
                    <div className="ms-3 flex-grow-1">
                      <h5>{order.product?.name || 'N/A'}</h5>
                      <p className="mb-1"><strong>Order ID:</strong> {order.orderId}</p>
                      <p className="mb-1"><strong>Quantity:</strong> {order.quantity}</p>
                      <p className="mb-1"><strong>Price:</strong> ₹{order.price.toFixed(2)}</p>
                      <p className="mb-1"><strong>Status:</strong> <span className="fw-bold">{dynamicStatus}</span></p>
                      <p className="mb-2"><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}

              {/* Action buttons for the entire order group */}
              <div className="d-flex gap-2 mt-2">
                <button className="btn btn-primary btn-sm" onClick={() => openTracker({ ...group[0], dynamicStatus: calculateDynamicStatus(group[0].orderDate) })}>
                  Track Order
                </button>
                {calculateDynamicStatus(group[0].orderDate) === 'Confirmed' && (
                  <button className="btn btn-danger btn-sm">Cancel Order</button>
                )}
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => window.open(`${BASE_URL}/invoice/view/razorpay/${razorpayOrderId}`, '_blank')}
                >
                  View Invoice
                </button>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => downloadInvoice(razorpayOrderId)}
                >
                  Download Invoice
                </button>



              </div>

            </div>
          ))
        )}
      </div>

      {/* Tracking Modal */}
      <Modal show={showTracker} onHide={closeTracker} centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Tracking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentOrder && (
            <>
              <h5>{currentOrder.product?.name}</h5>
              <p><strong>Order ID:</strong> {currentOrder.orderId}</p>
              <p><strong>Current Status:</strong> {currentOrder.dynamicStatus}</p>
              <ProgressBar
                now={statusProgress[currentOrder.dynamicStatus]}
                label={`${statusProgress[currentOrder.dynamicStatus]}%`}
                animated
                striped
                className="mb-3"
              />
              <div className="d-flex justify-content-between">
                <small>Confirmed</small>
                <small>Shipped</small>
                <small>Out for Delivery</small>
                <small>Delivered</small>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeTracker}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
}
