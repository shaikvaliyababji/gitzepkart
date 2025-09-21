import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container, Row, Col, Button, Navbar, Nav, ListGroup
} from 'react-bootstrap';


import {
  FiHome, FiBox, FiUsers, FiShoppingCart, FiDollarSign, FiLogOut
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import './AdminHome.jsx';
import SalesGraph from './SalesGraph';
import AddProduct from './ProductCRUD/AddProduct';
import UpdateProduct from './ProductCRUD/UpdateProduct';
import DeleteProduct from './ProductCRUD/DeleteProduct';
import ViewProduct from './ProductCRUD/ViewProduct';
import AddUser from './UserCRUD/AddUser';
import UpdateUser from './UserCRUD/UpdateUser';
import DeleteUser from './UserCRUD/DeleteUser';
import ViewUser from './UserCRUD/ViewUser';
import Orders from './Orders';
import Payments from './Payments';

import 'bootstrap/dist/css/bootstrap.min.css';
import { keyframes } from 'styled-components';
import AdminHome from './AdminHome.jsx';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledNavbar = styled(Navbar)`
  background: linear-gradient(135deg, #667eea, #764ba2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledButton = styled(Button)`
  background-color: ${props => props.variant === 'primary' ? '#6a5acd' : '#8884d8'};
  border-color: transparent;
  transition: all 0.3s ease;
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    background-color: ${props => props.variant === 'primary' ? '#5a4cbd' : '#7674c8'};
  }

  &:active {
    transform: translateY(0);
  }
`;

const StyledListGroup = styled(ListGroup)`
  .list-group-item {
    border: none;
    margin-bottom: 0.5rem;
    border-radius: 8px !important;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: #f0f0f0;
      transform: translateX(5px);
    }
    
    &.active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  }
`;

const ContentCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
`;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [operation, setOperation] = useState('');
  const [usercrudoperation, setUserCrudOperation] = useState('');
  const [responseData, setResponseData] = useState(null);

  const name = JSON.parse(localStorage.getItem("userData"))?.name;
  const image = JSON.parse(localStorage.getItem("userData"))?.profileImage;

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    const token = JSON.parse(localStorage.getItem('token'));

    if (!token) {
      alert('Unauthorized access! Please login.');
      navigate('/');
    }

    setResponseData(storedData);
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    alert('Logout successful');
    navigate('/');
  };

  const renderOperation = () => {
    switch (operation) {
      case 'addProduct': return <AddProduct />;
      case 'updateProduct': return <UpdateProduct />;
      case 'deleteProduct': return <DeleteProduct />;
      case 'viewProduct': return <ViewProduct />;
      default: return null;
    }
  };

  const renderUserCrudOperation = () => {
    switch (usercrudoperation) {
      case 'addUser': return <AddUser />;
      case 'updateUser': return <UpdateUser />;
      case 'deleteUser': return <DeleteUser />;
      case 'viewUser': return <ViewUser />;
      default: return null;
    }
  };

  const renderContent = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        {(() => {
          switch (activeTab) {
            case 'dashboard':
              return (
                <ContentCard>
                  <h3 className="mb-4">Welcome to the Admin Dashboard!</h3>
                  <div className="mt-4">
                    <h4>Sales Analytics</h4>
                    {/* <SalesGraph /> */}
                    <AdminHome/>
                  </div>
                </ContentCard>
              );
            case 'manageProducts':
              return (
                <ContentCard>
                  <h3 className="mb-4">Product Management</h3>
                  <div className="d-flex flex-wrap gap-2">
                    <StyledButton variant={operation === 'addProduct' ? 'primary' : 'secondary'} onClick={() => setOperation('addProduct')}>Add Product ➕</StyledButton>
                    <StyledButton variant={operation === 'updateProduct' ? 'primary' : 'secondary'} onClick={() => setOperation('updateProduct')}>Update Product ✏️</StyledButton>
                    <StyledButton variant={operation === 'deleteProduct' ? 'primary' : 'secondary'} onClick={() => setOperation('deleteProduct')}>Delete Product 🗑️</StyledButton>
                    <StyledButton variant={operation === 'viewProduct' ? 'primary' : 'secondary'} onClick={() => setOperation('viewProduct')}>View Products 👁️</StyledButton>
                  </div>
                  {renderOperation()}
                </ContentCard>
              );
            case 'manageUsers':
              return (
                <ContentCard>
                  <h3 className="mb-4">User Management</h3>
                  <div className="d-flex flex-wrap gap-2">
                    <StyledButton variant={usercrudoperation === 'addUser' ? 'primary' : 'secondary'} onClick={() => setUserCrudOperation('addUser')}>Add User ➕</StyledButton>
                    <StyledButton variant={usercrudoperation === 'updateUser' ? 'primary' : 'secondary'} onClick={() => setUserCrudOperation('updateUser')}>Update User ✏️</StyledButton>
                    <StyledButton variant={usercrudoperation === 'deleteUser' ? 'primary' : 'secondary'} onClick={() => setUserCrudOperation('deleteUser')}>Delete User 🗑️</StyledButton>
                    <StyledButton variant={usercrudoperation === 'viewUser' ? 'primary' : 'secondary'} onClick={() => setUserCrudOperation('viewUser')}>View Users 👁️</StyledButton>
                  </div>
                  {renderUserCrudOperation()}
                </ContentCard>
              );
            case 'orders': return <ContentCard><Orders /></ContentCard>;
            case 'payments': return <ContentCard><Payments /></ContentCard>;
            default: return null;
          }
        })()}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <Container fluid>
      <StyledNavbar expand="lg" variant="dark" className="mb-3 p-3">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <Navbar expand="lg" variant="dark" className="mb-3" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                    <Container fluid>
                        <Navbar.Brand>ZapKart Admin</Navbar.Brand>
                        <Navbar.Toggle aria-controls="admin-navbar-nav" />
                        <Navbar.Collapse id="admin-navbar-nav">
                            <Nav className="ms-auto d-flex align-items-center flex-column flex-lg-row">
                                <Button
                                    variant="outline-light"
                                    className="mb-2 mb-lg-0 me-lg-3 text-white"
                                    as={Link}
                                    to="/ProductsHome"
                                    style={{
                                        backgroundColor: '#6a5acd',
                                        borderColor: '#6a5acd',
                                        transition: 'background-color 0.3s ease, transform 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#4e4b8b';
                                        e.target.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#6a5acd';
                                        e.target.style.transform = 'scale(1)';
                                    }}
                                >
                                    Back
                                </Button>

                                <div className="d-flex align-items-center mb-2 mb-lg-0 me-lg-3">
                                    <p className="mb-0 me-2 text-white">{name}</p>
                                    {image && (
                                        <img
                                            src={`http://localhost:8080/images/${image}`}
                                            alt="profile"
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    )}
                                </div>

                                <Button
                                    variant="outline-light"
                                    onClick={logout}
                                    className="text-white"
                                    style={{
                                        backgroundColor: '#6a5acd',
                                        borderColor: '#6a5acd',
                                        transition: 'background-color 0.3s ease, transform 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#4e4b8b';
                                        e.target.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#6a5acd';
                                        e.target.style.transform = 'scale(1)';
                                    }}
                                >
                                    Logout
                                </Button>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
        </Container>
      </StyledNavbar>

      <Row>
        <Col md={2} className="ps-3">
          <StyledListGroup>
            <ListGroup.Item action active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
              <FiHome className="me-2" /> Dashboard
            </ListGroup.Item>
            <ListGroup.Item action active={activeTab === 'manageProducts'} onClick={() => setActiveTab('manageProducts')}>
              <FiBox className="me-2" /> Manage Products
            </ListGroup.Item>
            <ListGroup.Item action active={activeTab === 'manageUsers'} onClick={() => setActiveTab('manageUsers')}>
              <FiUsers className="me-2" /> Manage Users
            </ListGroup.Item>
            <ListGroup.Item action active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
              <FiShoppingCart className="me-2" /> Orders
            </ListGroup.Item>
            <ListGroup.Item action active={activeTab === 'payments'} onClick={() => setActiveTab('payments')}>
              <FiDollarSign className="me-2" /> Payments
            </ListGroup.Item>
          </StyledListGroup>
        </Col>
        <Col md={10} className="pe-4">
          {renderContent()}
        </Col>
      </Row>
    </Container>
  );
}
