import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Navbar, Nav, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import SalesGraph from './SalesGraph'
import SellerOrders from './SellerOrders';
import BASE_URL from "../../config";


import AddProduct from './ProductCRUD/AddProduct';
import UpdateProduct from './ProductCRUD/UpdateProduct';
import DeleteProduct from './ProductCRUD/DeleteProduct';
import ViewProduct from './ProductCRUD/ViewProduct';
import Orders from './Orders';

export default function SellerDashboard() {
    const navigate = useNavigate();
    const [responseData, setResponseData] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [operation, setOperation] = useState('');

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

    const handleTabChange = (tab) => setActiveTab(tab);
    const handleCrudOperations = (operation) => setOperation(operation);

    const renderOperation = () => {
        switch (operation) {
            case 'addProduct': return <AddProduct />;
            case 'updateProduct': return <UpdateProduct />;
            case 'deleteProduct': return <DeleteProduct />;
            case 'viewProduct': return <ViewProduct />;
            default: return null;
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div>
                        <h3>Welcome to the Seller Dashboard!</h3>
                        <div className="mt-4">
                            <h4>Sales Analytics</h4>
                            <SalesGraph /> {/* Add the Sales Graph here */}
                        </div>
                    </div>
                );
            case 'manageProducts':
                return (
                    <div>
                        <h3>Product Management Section</h3>
                        <Button variant={operation === 'addProduct' ? 'primary' : 'secondary'} onClick={() => handleCrudOperations('addProduct')}>Add Product ➕</Button>
                        <Button variant={operation === 'updateProduct' ? 'primary' : 'secondary'} onClick={() => handleCrudOperations('updateProduct')}>Update Product ✏️</Button>
                        <Button variant={operation === 'deleteProduct' ? 'primary' : 'secondary'} onClick={() => handleCrudOperations('deleteProduct')}>Delete Product ❌</Button>
                        <Button variant={operation === 'viewProduct' ? 'primary' : 'secondary'} onClick={() => handleCrudOperations('viewProduct')}>View Products 📋</Button>
                        {renderOperation()}
                    </div>
                );
            case 'orders':
                return <Orders />;
            case 'sellerOrders':
                return <SellerOrders />;

            default:
                return <h3>Select an option from the sidebar</h3>;
        }
    };

    return (
        <Container fluid>
            <Row>
                <Navbar expand="lg" variant="dark" className="mb-3" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                    <Container fluid>
                        <Navbar.Brand>ZapKart Seller</Navbar.Brand>
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
                                            src={`${BASE_URL}/images/${image}`}
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

            </Row>
            <Row>
                <Col md={2} className="bg-light p-3">
                    <h4>Seller Panel</h4>
                    <ListGroup>
                        <ListGroup.Item action onClick={() => handleTabChange('dashboard')} active={activeTab === 'dashboard'}>Dashboard</ListGroup.Item>
                        <ListGroup.Item action onClick={() => handleTabChange('manageProducts')} active={activeTab === 'manageProducts'}>Manage Products</ListGroup.Item>
                        <ListGroup.Item action onClick={() => handleTabChange('orders')} active={activeTab === 'orders'}>Orders</ListGroup.Item>
                        <ListGroup.Item action onClick={() => handleTabChange('sellerOrders')} active={activeTab === 'sellerOrders'}>Seller Orders</ListGroup.Item>

                    </ListGroup>
                </Col>
                <Col md={10} className="p-4">
                    {renderContent()}
                </Col>
            </Row>
        </Container>
    );
}
