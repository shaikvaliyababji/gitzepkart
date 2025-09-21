import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from "../../config";

export default function AdminHome() {
  const [customerCount, setCustomerCount] = useState(0);
  const [sellerCount, setSellerCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const headers = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const customerRes = await axios.get(`${BASE_URL}/api/users/customercount`, headers);
        const sellerRes = await axios.get(`${BASE_URL}/api/users/sellercount`, headers);
        const adminRes = await axios.get(`${BASE_URL}/api/users/admincount`, headers);

        setCustomerCount(customerRes.data.count || customerRes.data);
        setSellerCount(sellerRes.data.count || sellerRes.data);
        setAdminCount(adminRes.data.count || adminRes.data);
      } catch (error) {
        console.error('Error fetching counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [token]);

  return (
    <div style={{ textAlign: 'center', padding: '30px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h2>Welcome to Admin Dashboard</h2>

      {loading ? (
        <p>Loading counts...</p>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', marginTop: '30px', flexWrap: 'wrap' }}>
          <div style={cardStyle}>
            <h3 style={headingStyle}>Customers</h3>
            <p style={{ ...countStyle, color: '#007bff' }}>{customerCount}</p>
          </div>
          <div style={cardStyle}>
            <h3 style={headingStyle}>Sellers</h3>
            <p style={{ ...countStyle, color: '#28a745' }}>{sellerCount}</p>
          </div>
          <div style={cardStyle}>
            <h3 style={headingStyle}>Admins</h3>
            <p style={{ ...countStyle, color: '#ff5722' }}>{adminCount}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  padding: '25px',
  width: '200px',
};

const headingStyle = {
  marginBottom: '10px',
  color: '#333',
};

const countStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
};
