import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, Image } from 'react-bootstrap';
import CustomNavbar from '../Components/CustomNavbar';
import Footer from '../Components/Footer.jsx';
import { useNavigate } from 'react-router-dom';
import BASE_URL from "../config";

function Cart() {
  const [cartData, setCartData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const token = JSON.parse(localStorage.getItem('token'));
  const customerId = JSON.parse(localStorage.getItem('userData'))?.id;
  const navigate = useNavigate();

  useEffect(() => {
    if (cartData.length > 0) {
      const simplified = cartData.map(item => ({
        productId: item.product.productId,
        customerId: item.customer.id,
        quantity: item.quantity,
        price: item.product.price,
      }));
      localStorage.setItem('cartSummary', JSON.stringify(simplified));
    }
  }, [cartData]);

  useEffect(() => {
    if (!customerId) return;
    axios.get(`${BASE_URL}/api/cart/items`, {
      params: { customerId },
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setCartData(res.data))
    .catch(err => console.error('Fetch error:', err.response?.data || err.message));
  }, [customerId, token]);

  useEffect(() => {
    const total = cartData.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
    setTotalAmount(total);
  }, [cartData]);

  const updateQuantity = (index, newQty) => {
    if (newQty < 1) return;
    const updated = [...cartData];
    updated[index].quantity = newQty;
    setCartData(updated);
    axios.put(`${BASE_URL}/api/cart/update?customerId=${customerId}&productId=${updated[index].product.productId}&quantity=${newQty}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(err => {
      console.error('Update error:', err.response?.data || err.message);
      setCartData([...cartData]); // rollback
    });
  };

  const removeItem = index => {
    const item = cartData[index];
    axios.delete(`${BASE_URL}/api/cart/delete?customerId=${customerId}&productId=${item.product.productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      const updated = [...cartData];
      updated.splice(index, 1);
      setCartData(updated);
    }).catch(err => console.error('Delete error:', err.response?.data || err.message));
  };

  const removeAllItems = () => {
    axios.delete(`${BASE_URL}/api/cart/clear?customerId=${customerId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => setCartData([]))
      .catch(err => console.error('Clear error:', err.response?.data || err.message));
  };

  return (
    <>
      <CustomNavbar />
      <Container className="py-5" style={{ minHeight: 'calc(100vh - 150px)' }}>
        <h1 className="mb-5">My Cart</h1>
        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Body className="p-0">
                {cartData.length === 0 ? (
                  <div className="text-center py-4">
                    <h5>Your cart is empty</h5>
                    <p className="text-muted">Start shopping to add items to your cart</p>
                  </div>
                ) : (
                  <>
                    <div className="d-flex justify-content-end p-3 border-bottom">
                      <Button variant="outline-danger" size="sm" onClick={removeAllItems}>Remove All Items</Button>
                    </div>
                    <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                      {cartData.map((item, index) => {
                        const { product, quantity } = item;
                        const subtotal = product.price * quantity;
                        return (
                          <Row key={index} className="align-items-center p-3 border-bottom">
                            <Col md={2}><Image src={`${BASE_URL}/images/${product.profileImage}`} alt={product.name} fluid rounded style={{ width: '100px', height: '100px', objectFit: 'cover' }} /></Col>
                            <Col md={4}>
                              <h5>{product.name}</h5>
                              <p className="text-muted small">Brand: {product.brand}</p>
                              <p className="text-muted small">Size: M</p>
                              <Button variant="link" size="sm" className="text-danger p-0" onClick={() => removeItem(index)}>Remove</Button>
                            </Col>
                            <Col md={3}>
                              <div className="d-flex align-items-center border rounded">
                                <Button variant="light" className="px-2" onClick={() => updateQuantity(index, quantity - 1)}>-</Button>
                                <Form.Control readOnly type="text" value={quantity} className="text-center border-0" style={{ width: '40px' }} />
                                <Button variant="light" className="px-2" onClick={() => updateQuantity(index, quantity + 1)}>+</Button>
                              </div>
                            </Col>
                            <Col md={3} className="text-md-right">
                              <h6 className="mb-0">₹{subtotal.toFixed(2)}</h6>
                              <small className="text-muted">₹{product.price} each</small>
                            </Col>
                          </Row>
                        );
                      })}
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="shadow-sm sticky-top" style={{ top: '20px' }}>
              <Card.Body>
                <h5 className="mb-4">Order Summary</h5>
                <ul className="list-group mb-4">
                  <li className="list-group-item d-flex justify-content-between">Subtotal<span>₹{totalAmount.toFixed(2)}</span></li>
                  <li className="list-group-item d-flex justify-content-between">Shipping<span>TBD</span></li>
                  <li className="list-group-item d-flex justify-content-between">Tax<span>TBD</span></li>
                  <li className="list-group-item d-flex justify-content-between font-weight-bold">Estimated Total<span>₹{totalAmount.toFixed(2)}</span></li>
                </ul>
                <Button variant="warning" size="lg" block disabled={cartData.length === 0} onClick={() => navigate('/checkout')}>
                  Next
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default Cart;
