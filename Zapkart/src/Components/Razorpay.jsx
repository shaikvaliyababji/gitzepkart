import axios from 'axios';
import BASE_URL from "../config";

export default async function initiateRazorpayPayment({ totalAmount, token, customerId, addressId }) {
  if (!totalAmount) {
    alert('Cart is empty.');
    return;
  }

  return new Promise(async (resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';

    script.onload = async () => {
      try {
        // 1. Create order on backend
        const { data: order } = await axios.post(
          `${BASE_URL}/api/payments/create-order?amount=${totalAmount}&currency=INR`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const options = {
          key: 'rzp_test_w2sog5EU4t5UOh',
          amount: order.amount,
          currency: order.currency,
          name: 'ZapKart',
          description: 'Order Payment',
          order_id: order.id,
          handler: async function (response) {
            try {
              // 2. Record payment details
              await axios.post(`${BASE_URL}/api/payments/add`, {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                paymentMethod: 'razorpay',
                paymentStatus: 'success',
                amount: order.amount / 100,
              }, { headers: { Authorization: `Bearer ${token}` } });

              resolve(order.id); // ✅ Send back razorpayOrderId for later order creation

            } catch (err) {
              console.error('Error saving payment:', err.response?.data || err.message);
              reject(err);
            }
          },
          theme: { color: '#3399cc' },
          prefill: {
            email: JSON.parse(localStorage.getItem('userData'))?.email || '',
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

      } catch (err) {
        console.error('Razorpay order creation failed:', err.response?.data || err.message);
        alert('❌ Failed to initiate payment.');
        reject(err);
      }
    };

    script.onerror = () => {
      alert('Failed to load Razorpay. Check your internet connection.');
      reject(new Error('Razorpay script load failed'));
    };

    document.body.appendChild(script);
  });
}
