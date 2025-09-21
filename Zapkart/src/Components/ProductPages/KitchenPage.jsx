import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Modal, Spinner } from 'react-bootstrap';
import CustomNavbar from '../CustomNavbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiChevronRight } from 'react-icons/fi';
import { BsStarFill, BsLightningCharge } from 'react-icons/bs';
import BASE_URL from "../../config";

const KitchenPage = () => {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [show, setShow] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const token = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products/kitchen`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(response.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load products');
      }
    };

    fetchProducts();
  }, [token]);

  const handleClose = () => setShow(false);
  const handleShow = (product) => {
    setSelected(product);
    setShow(true);
  };

  const handleAddToCart = () => {
    const customerId = JSON.parse(localStorage.getItem("userData"))?.id;

    if (!customerId) {
      toast.error("Please log in first.");
      return;
    }

    if (!selected) {
      toast.error("No product selected");
      return;
    }

    setIsAddingToCart(true);

    const productId = selected.productId;
    const quantity = 1;

    axios.post(
      `${BASE_URL}/api/cart/add`,
      { customerId, productId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        toast.success("Product added to cart successfully!");
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to add product to cart.");
      })
      .finally(() => {
        setIsAddingToCart(false);
      });
  };

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      toast.success("Removed from wishlist");
    } else {
      setWishlist([...wishlist, productId]);
      toast.success("Added to wishlist");
    }
  };

  const renderRatingStars = () => {
    return Array(5).fill(0).map((_, i) => (
      <BsStarFill key={i} className={i < 4 ? "text-warning" : "text-muted opacity-25"} />
    ));
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <CustomNavbar />

      <Container className="my-5">
        <h2 className="mb-4">Kitchen Essentials</h2>

        <Row xs={1} md={2} lg={4} className="g-4">
          {products.map(product => (
            <Col key={product.id}>
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <Card className="h-100 border-0 shadow-sm position-relative">
                  <button
                    className="position-absolute top-0 end-0 btn btn-light rounded-circle m-2 p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                  >
                    <FiHeart
                      className={wishlist.includes(product.id) ? "text-danger" : "text-muted"}
                      style={{ fill: wishlist.includes(product.id) ? 'currentColor' : 'none' }}
                    />
                  </button>

                  <div
                    className="position-relative"
                    style={{ height: '200px', overflow: 'hidden', cursor: 'pointer' }}
                    onClick={() => handleShow(product)}
                  >
                    <Card.Img
                      variant="top"
                      src={`${BASE_URL}/images/${product.profileImage}`}
                      className="w-100 h-100 object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://dummyimage.com/300x300/cccccc/000000.png&text=No+Image';
                      }}
                    />
                  </div>

                  <Card.Body className="d-flex flex-column">
                    <div className="mb-2">
                      <h6 className="card-title mb-1" style={{ minHeight: '40px' }}>
                        { `${product.brand} ${product.model}`}
                      </h6>
                      <div className="d-flex align-items-center mb-1">
                        {renderRatingStars()}
                        <small className="text-muted ms-2">(24)</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="text-danger fs-5 fw-bold">₹{product.price}</span>
                        <span className="text-decoration-line-through text-muted ms-2">₹{Math.round(product.price * 1.2)}</span>
                        <span className="text-success ms-2">20% off</span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center">
                        {product.stock > 0 ? (
                          <small className="text-success">
                            <BsLightningCharge className="me-1" />
                            In Stock
                          </small>
                        ) : (
                          <small className="text-danger">Out of Stock</small>
                        )}
                        <button
                          className="btn btn-sm btn-outline-primary rounded-circle"
                          onClick={() => handleShow(product)}
                        >
                          <FiChevronRight />
                        </button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        <Modal show={show} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="fw-bold">
              {selected ? `${selected.brand} ${selected.model}` : ''}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                <div style={{ height: '300px', overflow: 'hidden' }}>
                  <img
                    src={`${BASE_URL}/images/${selected?.profileImage}`}
                    alt={selected?.name}
                    className="w-100 h-100 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://dummyimage.com/500x500/cccccc/000000.png&text=No+Image';
                    }}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-center mb-3">
                  {renderRatingStars()}
                  <span className="ms-2 text-muted">24 ratings</span>
                </div>

                <div className="mb-4">
                  <h3 className="text-danger fw-bold mb-2">₹{selected?.price}</h3>
                  <div className="d-flex align-items-center">
                    <span className="text-decoration-line-through text-muted me-2">₹{Math.round(selected?.price * 1.2)}</span>
                    <span className="text-success">20% off</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold">Description</h6>
                  <p>{selected?.description}</p>
                </div>

                <div className="mb-4">
                  <div className="row">
                    <div className="col-6">
                      <p className="text-muted mb-1">Brand</p>
                      <p className="fw-medium">{selected?.brand}</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted mb-1">Model</p>
                      <p className="fw-medium">{selected?.model}</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted mb-1">Availability</p>
                      <p className="fw-medium">
                        {selected?.stock > 0 ? (
                          <span className="text-success">In Stock</span>
                        ) : (
                          <span className="text-danger">Out of Stock</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={!selected?.stock || isAddingToCart}
                    className="btn btn-primary py-2 d-flex align-items-center justify-content-center gap-2"
                  >
                    {isAddingToCart ? (
                      <>
                        <Spinner animation="border" size="sm" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <FiShoppingCart />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default KitchenPage;
