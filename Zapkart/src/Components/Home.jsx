import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Navbar, Nav, Modal, Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Loginform from './Loginform';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiUser, FiSearch, FiChevronRight } from 'react-icons/fi';
import { FaStar, FaRegHeart, FaHeart } from 'react-icons/fa';
import Footer from './Footer';
import zapkarthorizontallogo from '/assets/zapkarthorizontallogo.png'; // Adjust path as needed
import BASE_URL from "../config";



// Animation variants
const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [wishlist, setWishlist] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const handleLoginClick = () => setShowLoginModal(true);
  const handleCloseModal = () => setShowLoginModal(false);
  const toggleWishlist = (id) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
    handleLoginClick(); // Show login modal when trying to add to wishlist
  };

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedZapkart");
  
    if (hasVisited === "true") {
      setShowOnboarding(false);
    } else {
      setShowOnboarding(true);
      localStorage.setItem("hasVisitedZapkart", "true");
    }
  
    // Handler to reset the flag on browser close
    const handleUnload = () => {
      localStorage.setItem("hasVisitedZapkart", "false");
    };
  
    // Add event listener for browser close or page refresh
    window.addEventListener("unload", handleUnload);
  
    // Cleanup function
    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  const handleSkip = () => {
    setShowOnboarding(false);
  };

  // Carousel items
  const carouselItems = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
      title: "Premium Audio Experience",
      subtitle: "Discover our collection of high-end headphones"
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
      title: "Smart Lifestyle",
      subtitle: "Elevate your daily routine with cutting-edge wearables"
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg",
      title: "Next-Gen Smartphones",
      subtitle: "Experience the future of mobile technology"
    },
    {
      id: 4,
      image: "https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg",
      title: "Home Entertainment",
      subtitle: "Transform your living space with immersive tech"
    }
  ];

  // Product categories
  const categories = [
    {
      id: 1,
      title: "Electronics",
      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      description: "Cutting-edge gadgets and devices",
      bgColor: "bg-gradient-to-r from-purple-500 to-indigo-600"
    },
    {
      id: 2,
      title: "Fashion",
      image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      description: "Trendy outfits for every occasion",
      bgColor: "bg-gradient-to-r from-pink-500 to-rose-500"
    },
    {
      id: 3,
      title: "Home & Living",
      image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      description: "Comfort for your living space",
      bgColor: "bg-gradient-to-r from-amber-500 to-orange-600"
    }
  ];

  // Featured products
  const products = [
    {
      id: 1,
      name: "Wireless Earbuds",
      price: 89.99,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      discount: 15
    },
    {
      id: 2,
      name: "Smart Fitness Band",
      price: 59.99,
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      discount: 10
    },
    {
      id: 3,
      name: "4K Ultra HD TV",
      price: 799.99,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1577979749830-f1d742b96791?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 4,
      name: "Bluetooth Speaker",
      price: 129.99,
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      discount: 20
    }
  ];

  const handleButtonClick = (e) => {
    e.preventDefault();
    handleLoginClick();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Onboarding Modal */}
      <Modal
        show={showOnboarding}
        onHide={handleSkip}
        centered
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body className="p-0 bg-white">
          <video
            src="/videos/Zapkart.mp4"
            autoPlay
            muted
            loop
            playsInline
            onEnded={handleSkip}
            width={500}
            height={500}
            className="object-contain mx-auto my-4 rounded"
          />
          <div className="text-center py-3 bg-white ">
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSkip}
            >
              Skip
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute left-0 top-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute right-0 bottom-1/3 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute left-1/3 top-1/2 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <Navbar expand="lg" className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <Container>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="transition-all duration-300"
          >
            <Navbar.Brand href="#" className="flex items-center">
  <motion.img
    src={zapkarthorizontallogo}
    alt="ZapKart Logo"
    className="w-30 h-12 object-contain"
    whileHover={{ rotate: 5 }}
    transition={{ type: "spring", stiffness: 300 }}
  />
</Navbar.Brand>

          </motion.div>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto space-x-6">
              {['Home', 'Shop', 'Categories', 'Deals'].map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ y: -2 }}
                  className="relative group"
                >
                  <Nav.Link 
                    href="#" 
                    className="text-gray-700 hover:text-indigo-600 transition-colors duration-300 text-lg font-medium"
                    onClick={handleButtonClick}
                  >
                    {item}
                  </Nav.Link>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </motion.div>
              ))}
            </Nav>

            <div className="flex items-center space-x-4">
              <motion.div className="position-relative" whileHover={{ scale: 1.1 }}>
                <FiSearch className="text-gray-500 position-absolute top-50 start-0 translate-middle-y ms-3" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="form-control ps-5 rounded-pill border-0 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLoginClick}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FiUser className="text-lg" />
                <span className="font-semibold text-base">Login</span>
              </motion.button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <Carousel fade indicators={false} className="overflow-hidden">
          {carouselItems.map((item) => (
            <Carousel.Item key={item.id} className="relative">
              <motion.div
                className="w-full h-[70vh] bg-cover bg-center relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${item.image})`
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1.5 }}
              >
                <div className="absolute inset-0 bg-black/20"></div>
              </motion.div>
              <div className="absolute bottom-[15%] left-[10%] text-left z-10">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="space-y-6"
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight">
                    {item.title}
                  </h2>
                  <p className="text-lg md:text-xl text-white drop-shadow-md max-w-lg">
                    {item.subtitle}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#fff' }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm text-indigo-600 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={handleButtonClick}
                  >
                    <span className="font-semibold text-base">Shop Now</span>
                    <FiChevronRight className="text-lg" />
                  </motion.button>
                </motion.div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </motion.div>

      {/* Categories Section */}
      <Container className="my-16">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="space-y-12"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2"
          >
            Shop by Category
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-gray-600 text-center max-w-2xl mx-auto"
          >
            Discover products in our most popular categories
          </motion.p>

          <Row className="g-6 mt-8">
            {categories.map((category) => (
              <Col key={category.id} md={4}>
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                  className="h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className={`h-full ${category.bgColor}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative h-64 overflow-hidden"
                    >
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 hover:opacity-0"></div>
                    </motion.div>
                    <div className="p-6 text-center text-white">
                      <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                      <p className="mb-4 opacity-90 text-lg">{category.description}</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 bg-white/90 backdrop-blur-sm text-indigo-600 rounded-full hover:shadow-lg transition-all duration-300 text-base font-medium"
                        onClick={handleButtonClick}
                      >
                        Explore
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </Container>

      {/* Featured Products */}
      <Container className="my-16 py-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="text-center md:text-left">
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight"
              >
                Featured Products
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-lg text-gray-600 mt-2"
              >
                Our most popular products this season
              </motion.p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-6 py-3 rounded-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 text-base font-medium"
              onClick={handleButtonClick}
            >
              <span>View All</span>
              <FiChevronRight className="text-xl" />
            </motion.button>
          </div>

          <Row className="g-8">
            {products.map((product) => (
              <Col key={product.id} sm={6} md={4} lg={3}>
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="h-full group"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="relative aspect-w-1 aspect-h-1 flex-grow">
                      <motion.div
                        className="w-full h-full"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                          style={{ aspectRatio: '1/1' }}
                        />
                      </motion.div>
                      <motion.button
                        className="absolute top-4 right-4 p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl border-0 transition-all duration-300 z-10"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleWishlist(product.id)}
                        aria-label="Add to wishlist"
                      >
                        {wishlist[product.id] ? (
                          <FaHeart className="text-red-500 text-xl" />
                        ) : (
                          <FaRegHeart className="text-gray-600 text-xl" />
                        )}
                      </motion.button>
                      {product.discount && (
                        <div className="absolute top-4 left-4 z-10">
                          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
                            {product.discount}% OFF
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5 space-y-4 flex flex-col flex-grow-0">
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex justify-between items-center mt-auto">
                        <div className="space-y-1">
                          <span className="text-xl font-bold text-indigo-600 block">
                            ${product.price}
                          </span>
                          {product.discount && (
                            <span className="text-sm text-gray-400 line-through block">
                              ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 bg-gray-50 px-3 py-1 rounded-full">
                          <FaStar className="text-yellow-400 text-md" />
                          <span className="font-semibold text-gray-600 text-sm">{product.rating}</span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full font-semibold text-base shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                        onClick={handleButtonClick}
                      >
                        <FiShoppingCart className="text-lg" />
                        <span>Add to Cart</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </Container>

      {/* Newsletter Section */}
      <div className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600 relative overflow-hidden">
        {/* Background Animation Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -left-1/4 -top-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
          <div className="absolute -right-1/4 -bottom-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <Container className="relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
            >
              Subscribe to Our Newsletter
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-white/90 mb-8 max-w-2xl mx-auto"
            >
              Get the latest updates on new products and upcoming sales
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
            >
              <div className="w-full sm:w-2/3 relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  aria-label="Email address"
                  className="w-full px-6 py-3 rounded-full text-gray-800 bg-white/95 backdrop-blur-sm border-2 border-transparent focus:border-indigo-300 focus:ring-4 focus:ring-indigo-300/20 focus:outline-none transition-all duration-300 placeholder:text-gray-400 text-base"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#fff' }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-full bg-white text-indigo-600 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:text-indigo-700 w-full sm:w-auto text-base"
              >
                Subscribe
              </motion.button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-white/80 mt-4"
            >
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </motion.p>
          </motion.div>
        </Container>
      </div>

      {/* Login Modal */}
      <Modal
        show={showLoginModal}
        onHide={handleCloseModal}
        centered
        dialogClassName="modal-sm"
      >
        <Modal.Body className="p-0">
          <Loginform onLoginSuccess={handleCloseModal} />
        </Modal.Body>
      </Modal>

      <Footer />
    </div>
  );
}