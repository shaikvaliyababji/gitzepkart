import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import CustomNavbar from './CustomNavbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BASE_URL from "../config";
// Enhanced CSS styles for consistent UI
const imageContainerStyle = {
  width: '100%',
  height: '240px',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: '0.5rem 0.5rem 0 0',
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  transition: 'transform 0.5s cubic-bezier(0.25, 0.45, 0.45, 0.95)',
};

const ProductsHome = () => {
  const [loading, setLoading] = useState(true);
  const [computers, setComputers] = useState([]);
  const [fridges, setFridges] = useState([]);
  const [mobiles, setMobiles] = useState([]);
  const [watches, setWatches] = useState([]);
  const [menwear, setMenwear] = useState([]);
  const [womanwear, setWomanwear] = useState([]);
  const [speaker, setSpeaker] = useState([]);
  const [tv, setTv] = useState([]);
  const [ac, setAc] = useState([]);
  const [furniture, setFurniture] = useState([]);
  const [kitchen, setKitchen] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const navigate = useNavigate();

  // Initialize AOS with refined settings
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-in-out-quad',
      mirror: false,
    });
  }, []);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    const fetchData = async () => {
      try {
        setLoading(true);

        const categories = [
          { name: 'computers', setter: setComputers },
          { name: 'fridge', setter: setFridges },
          { name: 'mobile', setter: setMobiles },
          { name: 'watch', setter: setWatches },
          { name: 'menwear', setter: setMenwear },
          { name: 'womanwear', setter: setWomanwear },
          { name: 'speaker', setter: setSpeaker },
          { name: 'tv', setter: setTv },
          { name: 'kitchen', setter: setKitchen },
          { name: 'ac', setter: setAc },
          { name: 'furniture', setter: setFurniture }
        ];

        const fetchPromises = categories.map(category =>
          axios.get(`${BASE_URL}/api/products/${category.name}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(res => category.setter(res.data))
            .catch(err => {
              console.error(`Error fetching ${category.name} products:`, err);
              return [];
            })
        );

        await Promise.all(fetchPromises);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleShow = (product, category) => {
    const categoryRouteMap = {
      'computers': '/ProductsHome/Computers',
      'fridges': '/ProductsHome/Fridges',
      'mobiles': '/ProductsHome/Mobiles',
      'watches': '/ProductsHome/Watches',
      'menwear': '/ProductsHome/Menwear',
      'womanwear': '/ProductsHome/Womanwear',
      'speaker': '/ProductsHome/speaker',
      'tv': '/ProductsHome/tv',
      'furniture': '/ProductsHome/furniture',
      'ac': '/ProductsHome/ac',
      'kitchen': '/ProductsHome/kitchen'
    };

    navigate(categoryRouteMap[category] || '/');
  };

  // Enhanced animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 15px 30px rgba(0,0,0,0.12)",
      transition: {
        duration: 0.4,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    },
    tap: {
      scale: 0.98
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const getCategoryFallbackImage = (category) => {
    const fallbackImages = {
      'computers': 'https://images.unsplash.com/photo-1593642702909-dec73df255d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'fridges': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'mobiles': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'watches': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'menwear': 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'womanwear': 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'speaker': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'tv': 'https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'ac': 'https://images.unsplash.com/photo-1581275239963-e19571ef5055?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'kitchen': 'https://images.unsplash.com/photo-1556909211-36987daf7b4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    };

    return fallbackImages[category] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
  };

  const renderProductCard = (product, category, index) => (
    <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-6">
      <motion.div
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        variants={cardVariants}
        transition={{ delay: index * 0.05 }}
        className="h-full"
      >
        <div
          onClick={() => handleShow(product, category)}
          className="bg-white rounded-lg overflow-hidden shadow-sm h-full flex flex-col cursor-pointer border border-gray-100 hover:border-blue-100 transition-all duration-300"
        >
          {/* Image Container */}
          <div className="relative group h-44 overflow-hidden">
            <img
              src={`${BASE_URL}/images/${product.profileImage}`}
              alt={product.title || `${product.brand} ${product.model}`}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getCategoryFallbackImage(category);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-xs font-medium tracking-wide transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                View Details
              </span>
            </div>
          </div>

          {/* Product Details */}
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2 leading-tight">
              {`${product.brand} ${product.model}`}
            </h3>
            <p className="text-xs text-gray-500 mb-3 line-clamp-1">
              {product.brand || 'Brand'} {product.model || 'Model'}
            </p>
            <div className="mt-auto flex justify-between items-center">
              {product.price && (
                <span className="text-blue-600 font-bold text-sm">
                  ${product.price.toLocaleString()}
                </span>
              )}
              <div className="flex items-center">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs text-gray-500 ml-1">4.8</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Col>
  );


  const renderCategorySection = (title, products, categorySlug) => {
    if (!products || products.length === 0) return null;

    return (
      <div className="mb-16" data-aos="fade-up" data-aos-delay="100">
        <div className="flex justify-between items-center mb-6">
          <motion.h3
            className="text-xl md:text-2xl font-bold text-gray-800 relative inline-block"
            initial="hidden"
            animate="visible"
            variants={headerVariants}
            onMouseEnter={() => setActiveCategory(categorySlug)}
            onMouseLeave={() => setActiveCategory('')}
          >
            {title}
            <motion.div
              className="absolute -bottom-1 left-0 h-1 bg-blue-500"
              initial={{ width: '20%' }}
              animate={{ width: activeCategory === categorySlug ? '100%' : '20%' }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </motion.h3>
          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="text-blue-600 hover:text-blue-800 font-medium text-xs md:text-sm transition-colors duration-200 flex items-center"
            onClick={() => handleShow(null, categorySlug)}
          >
            View All
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
        <Row className="g-4">
          {products.slice(0, 4).map((product, index) => renderProductCard(product, categorySlug, index))}
        </Row>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <CustomNavbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{
              rotate: 360,
              transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          >
            <Spinner animation="border" role="status" variant="primary" className="w-12 h-12" />
          </motion.div>
          <motion.p
            className="mt-4 text-gray-600 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading amazing products for you...
          </motion.p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <CustomNavbar />

      {/* Enhanced Hero Banner */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-24 md:py-32 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyIC44IDIgMnYyMmMwIDEuMi0uOCAyLTIgMkgxOGMtMS4yIDAtMi0uOC0yLTJWMjBjMC0xLjIuOC0yIDItMmgxOHoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjIpIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-3xl blur-3xl"></div>
        <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-blue-400/10 rounded-3xl blur-3xl"></div>

        {/* Animated particles - adjusted sizes and positioning */}
        <div className="absolute top-20 left-10 w-2.5 h-2.5 rounded-full bg-white opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-1/4 w-4 h-4 rounded-full bg-white opacity-20" style={{ animation: "float 10s ease-in-out infinite" }}></div>
        <div className="absolute bottom-32 left-16 w-3.5 h-3.5 rounded-full bg-white opacity-20" style={{ animation: "float 8s ease-in-out 2s infinite" }}></div>
        <div className="absolute top-24 right-1/4 w-5 h-5 rounded-full bg-white opacity-20" style={{ animation: "float 12s ease-in-out 1s infinite" }}></div>
        <div className="absolute bottom-20 right-20 w-2.5 h-2.5 rounded-full bg-white opacity-20" style={{ animation: "float 9s ease-in-out 0.5s infinite" }}></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center px-4">
            {/* Subtle top badge - adjusted padding and rounded */}
            <div className="inline-block mb-6 bg-white/10 backdrop-blur-sm px-5 py-1.5 rounded-xl text-sm font-medium">
              <span className="text-yellow-300">★</span> Premium Collection 2025
            </div>

            {/* Main heading with enhanced typography */}
            <h1 className="text-4xl font-bold mb-6 md:text-5xl lg:text-6xl tracking-tight leading-tight">
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400">Exceptional</span> Products
            </h1>

            {/* Subheading with improved readability */}
            <p className="text-lg md:text-xl font-light mb-8 max-w-2xl mx-auto leading-relaxed text-blue-50">
              Explore our curated collection of premium products with exclusive offers, free shipping, and a 100% satisfaction guarantee.
            </p>

            {/* Enhanced call-to-action buttons - adjusted padding and rounded */}
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="group bg-white text-blue-800 px-8 py-3.5 rounded-xl font-bold hover:bg-yellow-200 transition-all duration-300 text-sm md:text-base shadow-lg hover:shadow-xl flex items-center justify-center">
                Shop Now
                <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
              <button className="bg-transparent border-2 border-white/70 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/10 transition-all duration-300 text-sm md:text-base backdrop-blur-sm">
                Explore Categories
              </button>
              <br/><br/>
            </div><br/>

            {/* Trust badges - adjusted spacing and rounded */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-blue-100/80">
              <div className="flex items-center bg-white/5 px-3 py-1.5 rounded-lg">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                Secure Payment
              </div>
              <div className="flex items-center bg-white/5 px-3 py-1.5 rounded-lg">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                Free Shipping
              </div>
              <div className="flex items-center bg-white/5 px-3 py-1.5 rounded-lg">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Easy Returns
              </div>
              <div className="flex items-center bg-white/5 px-3 py-1.5 rounded-lg">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                24/7 Support
              </div>
            </div>
          </div>
        </div>

        {/* Floating product preview - adjusted size and rounded */}
        <div className="absolute -bottom-10 right-12 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="bg-white rounded-xl w-44 h-44 flex items-center justify-center">
              <span className="text-blue-800 opacity-30 text-sm">Product Preview</span>
            </div>
            <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              NEW
            </div>
          </div>
        </div>

        {/* Add floating animation for visual interest */}
        <style jsx>{`
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }
  `}</style>
      </div>

      {/* Main Products Section */}
      <div className="py-16 bg-gray-50">
        <Container>
          {renderCategorySection('Computers & Laptops', computers, 'computers')}
          {renderCategorySection('Refrigerators', fridges, 'fridges')}
          {renderCategorySection('Mobile Phones', mobiles, 'mobiles')}
          {renderCategorySection('Men\'s Fashion', menwear, 'menwear')}
          {renderCategorySection('Watches', watches, 'watches')}
          {renderCategorySection('Women\'s Fashion', womanwear, 'womanwear')}
          {renderCategorySection('Audio Speakers', speaker, 'speaker')}
          {renderCategorySection('Televisions', tv, 'tv')}
          {renderCategorySection('Kitchen Essentials', kitchen, 'kitchen')}
          {renderCategorySection('Air Conditioners', ac, 'ac')}
          {renderCategorySection('Furniture', furniture, 'furniture')}
        </Container>
      </div>

      {/* Featured Categories */}
      <div className="py-20 bg-white">
        <Container>
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-center mb-12 relative pb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Shop By Categories
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-blue-500 rounded-full"></div>
          </motion.h2>
          <Row className="g-6">
            {[
              {
                name: 'Electronics',
                image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                category: 'computers',
                icon: '💻'
              },
              {
                name: 'Fashion',
                image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                category: 'menwear',
                icon: '👕'
              },
              {
                name: 'Appliances',
                image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                category: 'fridges',
                icon: '🏠'
              },
              {
                name: 'Furniture',
                image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                category: 'furniture',
                icon: '🛋️'
              }
            ].map((category, index) => (
              <Col key={index} md={3} sm={6} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-xl overflow-hidden shadow-md cursor-pointer h-full border border-gray-100 hover:border-blue-200 transition-all duration-300"
                  onClick={() => handleShow(null, category.category)}
                >
                  <div style={{ ...imageContainerStyle, height: '180px' }} className="relative">
                    <img
                      src={category.image}
                      alt={category.name}
                      style={imageStyle}
                      className="transform transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getCategoryFallbackImage(category.category);
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-sm">
                      {category.icon}
                    </div>
                  </div>
                  <div className="bg-white py-4 px-4 text-center">
                    <h4 className="text-gray-800 font-bold text-lg mb-1">{category.name}</h4>
                    <p className="text-gray-500 text-xs">Shop now</p>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <Container className="relative z-10">
          <Row className="items-center">
            <Col lg={6} className="mb-8 lg:mb-0">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Join Our Newsletter</h3>
                <p className="text-gray-300 text-base md:text-lg max-w-lg">
                  Subscribe to get exclusive offers, product updates and early access to sales.
                </p>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-5 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-base"
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 font-bold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 text-base shadow-lg hover:shadow-xl"
                >
                  Subscribe
                </motion.button>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Flash Sale Banner */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <Container className="relative z-10">
          <Row className="items-center">
            <Col md={7} className="mb-8 md:mb-0">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Flash Sale! Up to 50% Off</h3>
                <p className="text-base md:text-lg mb-6 opacity-90">
                  Limited time offer on selected products. Hurry before it's gone!
                </p>
                <div className="flex space-x-4">
                  {[
                    { value: '10', label: 'Days' },
                    { value: '05', label: 'Hours' },
                    { value: '32', label: 'Minutes' }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      className="text-center"
                    >
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg w-16 h-16 flex items-center justify-center text-xl font-bold border border-white/20">
                        {item.value}
                      </div>
                      <div className="mt-2 text-xs opacity-80">{item.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </Col>
            <Col md={5} className="text-center md:text-right">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white text-red-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 text-sm shadow-lg hover:shadow-xl"
              >
                Shop the Sale
              </motion.button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-gray-50">
        <Container>
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-center mb-12 relative pb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            What Our Customers Say
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-blue-500 rounded-full"></div>
          </motion.h2>
          <Row>
            {[
              {
                name: "Sarah Johnson",
                photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                quote: "Amazing selection of products with great prices. The delivery was faster than expected!",
                rating: 5,
                role: "Frequent Shopper"
              },
              {
                name: "Michael Chen",
                photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                quote: "The quality of the products exceeded my expectations. Will definitely shop here again.",
                rating: 5,
                role: "Tech Enthusiast"
              },
              {
                name: "Emma Wilson",
                photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                quote: "Customer service is exceptional. They were very helpful in finding exactly what I needed.",
                rating: 4,
                role: "Home Decor Lover"
              }
            ].map((testimonial, index) => (
              <Col key={index} md={4} className="mb-6 md:mb-0">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-sm h-full border border-gray-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-blue-100">
                      <img
                        src={testimonial.photo}
                        alt={testimonial.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80";
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                      <p className="text-xs text-gray-500">{testimonial.role}</p>
                      <div className="flex mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        {[...Array(5 - testimonial.rating)].map((_, i) => (
                          <svg key={i + testimonial.rating} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">"{testimonial.quote}"</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      <Footer />
    </>
  );
};

export default ProductsHome;