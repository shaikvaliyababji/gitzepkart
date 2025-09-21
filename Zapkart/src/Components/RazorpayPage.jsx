import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Button, Form } from 'react-bootstrap';
import initiateRazorpayPayment from './Razorpay';
import BASE_URL from "../config";

function RazorpayPage() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const token = JSON.parse(localStorage.getItem('token'));
  const customerId = JSON.parse(localStorage.getItem('userData'))?.id;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/address/user/${customerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const formatted = response.data.map(addr => ({
          id: addr.id,
          line: `${addr.houseNumber}, ${addr.street}, ${addr.city}, ${addr.state}, ${addr.pincode}`
        }));
        setAddresses(formatted);
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
      }
    };

    fetchAddresses();

    const cartSummary = JSON.parse(localStorage.getItem('cartSummary')) || [];
    const total = cartSummary.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setTotalAmount(total);
  }, [customerId, token]);

  const handleCheckout = async () => {
    if (!selectedAddressId) return;
    setLoading(true);

    try {
      // 1. Start Razorpay (get order ID)
      const razorpayOrderId = await initiateRazorpayPayment({
        totalAmount,
        token,
        customerId,
        addressId: selectedAddressId
      });

      // 2. Prepare order payload
      const cartSummary = JSON.parse(localStorage.getItem('cartSummary')) || [];
      const orderPayload = cartSummary.map(item => ({
        customer: { id: customerId },
        product: { productId: item.productId },
        quantity: item.quantity,
        price: item.price,
        status: 'Confirmed',
        shippingAddress: { id: selectedAddressId },
        razorpayOrderId
      }));

      // 3. Save orders to backend
      const response = await axios.post(`${BASE_URL}/api/orders/add-multiple`, orderPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        alert('🎉 Payment successful and order placed!');
        localStorage.removeItem('cartSummary');
        window.location.href = '/';
      } else {
        alert('❌ Order could not be placed. Please try again.');
      }

    } catch (error) {
      console.error('Order placement or payment failed:', error);
      alert('❌ Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h2>Select Delivery Address</h2>
      <Card className="p-3 mb-4">
        <Form>
          {addresses.map(address => (
            <Form.Check
              type="radio"
              key={address.id}
              label={address.line}
              name="address"
              id={`address-${address.id}`}
              checked={selectedAddressId === address.id}
              onChange={() => setSelectedAddressId(address.id)}
            />
          ))}
        </Form>
      </Card>
      <Button
        variant="success"
        disabled={!selectedAddressId || loading}
        onClick={handleCheckout}
      >
        {loading ? 'Processing...' : 'Proceed to Checkout'}
      </Button>
    </Container>
  );
}

export default RazorpayPage;
