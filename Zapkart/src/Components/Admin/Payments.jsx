import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from "../../config";

export default function Payments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const response = await axios.get(`${BASE_URL}/api/payments/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetched Payments:', response.data);
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Payments</h1>
      <div className="grid grid-cols-1 gap-4">
        {payments.map((payment) => (
          <div key={payment.paymentId} className="border rounded p-4 shadow">
            <h2 className="text-xl font-semibold">Payment ID: {payment.paymentId}</h2>
            <p>Razorpay Order ID: {payment.razorpayOrderId}</p>
            <p>Amount: ₹{payment.amount}</p>
            <p>Payment Method: {payment.paymentMethod}</p>
            <p>Status: {payment.paymentStatus}</p>
            <p>Payment Date: {new Date(payment.paymentDate).toLocaleString()}</p>
            {payment.razorpayPaymentId && (
              <p>Razorpay Payment ID: {payment.razorpayPaymentId}</p>
            )}
            {payment.razorpaySignature && (
              <p>Razorpay Signature: {payment.razorpaySignature}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
