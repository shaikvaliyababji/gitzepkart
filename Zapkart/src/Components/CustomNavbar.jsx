import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import zapkarthorizontallogo from '/assets/zapkarthorizontallogo.png';
import {
  Navbar,
  Nav,
  Container,
  Button,
  Badge,
  Dropdown
} from "react-bootstrap";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiChevronDown
} from "react-icons/fi";
import axios from "axios"; // ✅ added axios
import BASE_URL from "../config";

const CustomNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const role = JSON.parse(localStorage.getItem("userData"))?.role;
  const name = JSON.parse(localStorage.getItem("userData"))?.name;
  const image = JSON.parse(localStorage.getItem("userData"))?.profileImage;

  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);


  const categories = [
    { label: "Mobiles", to: "/ProductsHome/Mobiles" },
    { label: "Computers", to: "/ProductsHome/computers" },
    { label: "Watches", to: "/ProductsHome/Watches" },
    { label: "Men's Wear", to: "/ProductsHome/Menwear" },
    { label: "Women's Wear", to: "/ProductsHome/Womanwear" },
    { label: "Furniture", to: "/ProductsHome/furniture" },
    { label: "Kitchen", to: "/ProductsHome/kitchen" },
    { label: "Refrigirators", to: "/ProductsHome/Fridges" },
    { label: "Speakers", to: "/ProductsHome/speaker" },
    { label: "TVs", to: "/ProductsHome/tv" },
    { label: "AC", to: "/ProductsHome/ac" },
  ];

  const logout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    alert('Logout successful');
    navigate('/');
  };



  return (
    <div className="navbar-section sticky-top">
      {/* Main Navbar */}
      <Navbar
        expand="lg"
        className="bg-white shadow-sm py-3"
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      >
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

          <Navbar.Toggle aria-controls="main-navbar" className="border-0">
            <FiMenu className="text-gray-600" />
          </Navbar.Toggle>

          <Navbar.Collapse id="main-navbar" className="justify-content-between">
            {/* Categories Dropdown */}
            <div className="d-none d-lg-flex align-items-center">
              <Dropdown>
                <Dropdown.Toggle
                  variant="light"
                  className="d-flex align-items-center bg-white border-0 text-dark fw-medium"
                >
                  <span className="me-1">Shop by Category</span>
                  <FiChevronDown className="ms-1" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="mt-2 p-3 shadow-sm" style={{ width: "800px" }}>
                  <div className="d-flex flex-wrap">
                    {categories.map((item, idx) => (
                      <Dropdown.Item
                        key={idx}
                        as={Link}
                        to={item.to}
                        className="col-3 text-decoration-none text-dark p-2"
                      >
                        <motion.div whileHover={{ x: 5 }} className="d-flex align-items-center">
                          <span className="ms-2">{item.label}</span>
                        </motion.div>
                      </Dropdown.Item>
                    ))}
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </div>



            {/* Right Section */}
            <div className="d-flex align-items-center justify-content-center ms-lg-3 gap-3">
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

              <motion.div className="position-relative" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Nav.Link as={Link} to="/cart" className="p-0 text-dark position-relative">
                  <FiShoppingCart className="h5 mb-0" />
                </Nav.Link>
              </motion.div>

              <div className="d-flex align-items-center position-relative">
                <p className="mb-0 me-2">{name}</p>
                {image && (
                  <img
                    src={`http://localhost:8080/images/${image}`}
                    alt="profile"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      cursor: "pointer"
                    }}
                    onClick={() => setShowProfileOptions(prev => !prev)}
                  />
                )}
                {showProfileOptions && (
                  <div
                    className="position-absolute bg-white border rounded shadow p-2"
                    style={{
                      top: "50px",
                      right: "0",
                      minWidth: "180px",
                      zIndex: 1000
                    }}
                  >
                    <ul className="list-unstyled mb-0">
                      <li
                        className="p-2 hover-bg text-dark"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate('/manage-profile')}
                      >
                        Manage My Profile
                      </li>
                      <li
                        className="p-2 hover-bg text-dark"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate('/my-orders')}
                      >
                        My Orders
                      </li>
                      {role === "ADMIN" || role === "SELLER" ? (
                        <li
                          className="p-2 hover-bg text-dark"
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(role === "ADMIN" ? '/admin' : '/seller')}
                        >
                          My Dashboard
                        </li>
                      ) : null}
                    </ul>
                  </div>
                )}
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline-primary"
                  className="rounded-pill px-3 d-flex align-items-center"
                  onClick={logout}
                >
                  <FiUser className="me-1" />
                  <span className="d-none d-lg-inline">Logout</span>
                </Button>
              </motion.div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Categories */}
      <Navbar expand="lg" className="bg-light d-lg-none shadow-sm border-top">
        <Container>
          <Navbar.Toggle
            aria-controls="mobile-categories"
            className="border-0 w-100 d-flex justify-content-center"
          >
            <span className="me-2">Browse Categories</span>
            <FiChevronDown />
          </Navbar.Toggle>
          <Navbar.Collapse id="mobile-categories">
            <Nav className="flex-column py-2">
              {categories.map((item, idx) => (
                <Nav.Link
                  key={idx}
                  as={Link}
                  to={item.to}
                  className="text-dark py-2 px-3 border-bottom"
                  onClick={() => setExpanded(false)}
                >
                  {item.label}
                </Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default CustomNavbar;
