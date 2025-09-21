import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Modal, Button } from 'react-bootstrap';
import Forgotpassword from './Forgotpassword';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiEye, FiEyeOff, FiLoader, FiLogIn, FiLock, FiUser } from 'react-icons/fi';
import styled, { keyframes } from 'styled-components';
import ReCAPTCHA from "react-google-recaptcha";

import BASE_URL from "../config";


const blobAnimation = keyframes`
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
`;

const BackgroundBlob = styled.div`
  position: absolute;
  width: 16rem;
  height: 16rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  mix-blend-mode: overlay;
  filter: blur(24px);
  animation: ${blobAnimation} 7s infinite;
  pointer-events: none;
`;

export default function Loginform({ onLoginSuccess }) {
  const [responseData, setResponseData] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [image, setImage] = useState(null);
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstOtpInput, setFirstOtpInput] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setResponseData(JSON.parse(storedData));
    }
  }, []);

  const toggleRegister = () => setShowRegister((prev) => !prev);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id.replace('reg-', '')]: value,
    }));
  };

  // Add this new handler for OTP input
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1) {
      const newOtp = otp.split('');
      newOtp[index] = value;
      setOtp(newOtp.join(''));

      // Move to next input
      if (value.length === 1 && index < 5) {
        e.target.nextElementSibling?.focus();
      }
    }
  };


  const handleLoginChange = (e) => {
    const { id, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const onChange = (value) => {
    console.log("Captcha value:", value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = new FormData();
    for (let key in formData) {
      payload.append(key, formData[key]);
    }
    if (image) {
      payload.append('image', image);
    }

    try {
      const registerResponse = await axios.post(`${BASE_URL}/api/users/register`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      localStorage.setItem('userData', JSON.stringify(registerResponse.data));
      setMessage('Registration successful! Please verify your email.');
      setVariant('success');
      setShowOtpModal(true);
    } catch (error) {
      console.error('Error during registration:', error.response ? error.response.data : error.message);
      setMessage('Registration failed. Please try again.');
      setVariant('danger');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtpAndRegister = async () => {
    setIsLoading(true);
    try {
      const storedData = JSON.parse(localStorage.getItem('userData'));
      const email = storedData?.email || '';

      await axios.post(`${BASE_URL}/api/users/verify-otp`, null, {
        params: { email, otp },
      });

      setMessage('Email verified successfully!');
      setVariant('success');
      alert('Email verified successfully! You can now log in.');
      navigate('/');
    } catch (error) {
      console.error('Error during OTP verification:', error.response ? error.response.data : error.message);
      setMessage('Invalid OTP, please try again.');
      setVariant('danger');
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/users/signin`, loginData);

      localStorage.setItem('token', JSON.stringify(response.data));
      setResponseData(response.data);
      fetchUserDetails(response.data);
      onLoginSuccess();
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      alert('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserDetails = (token) => {
    axios
      .get(`${BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        localStorage.setItem('userData', JSON.stringify(response.data));
        setResponseData(response.data);
        navigate('/ProductsHome', { state: { role: response.data.role } });
      })
      .catch((error) => {
        console.error('Failed to fetch user details:', error.response ? error.response.data : error.message);
        alert('Failed to fetch user details. Please try logging in again.');
      });
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <h2 className="text-2xl font-bold text-center">
          {showRegister ? 'Create Your Account' : 'Welcome Back'}
        </h2>
        <p className="text-center text-blue-100 mt-1">
          {showRegister ? 'Join us today' : 'Sign in to continue'}
        </p>
      </div>

      <div className="p-8">
        {!showRegister ? (
          <form className="space-y-5" onSubmit={loginUser}>
            <div className="space-y-1">
              <label className="block text-gray-700 text-sm font-medium">Email</label>
              <input
                type="text"
                id="email"
                value={loginData.email}
                onChange={handleLoginChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                placeholder="hello@example.com"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-gray-700 text-sm font-medium">Password</label>
              <input
                type="password"
                id="password"
                value={loginData.password}
                onChange={handleLoginChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                placeholder="••••••••"
                required
              />
              <div className="mt-3 flex justify-center items-center">
                <div style={{ transform: 'scale(0.7)', transformOrigin: 'center' }}>
                  <ReCAPTCHA
                    sitekey="6LcYDzUrAAAAAAszGQA24ROkpnf9U1ytFYRxUNnR"
                    onChange={onChange}
                  />
                </div>
              </div>



            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                }`}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
            <p className="text-center text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer pt-2">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Forgot Password?
              </button>
            </p>

            <p className="text-center text-sm text-gray-600 pt-2">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={toggleRegister}
                className="text-blue-600 hover:text-blue-800 font-medium transition-all"
              >
                Register now
              </button>
            </p>
          </form>
        ) : (
          <form className="space-y-5" onSubmit={registerUser}>
            <div className="space-y-1">
              <label className="block text-gray-700 text-sm font-medium">Email</label>
              <input
                type="email"
                id="reg-email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                placeholder="hello@example.com"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-gray-700 text-sm font-medium">Full Name</label>
              <input
                type="text"
                id="reg-name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-gray-700 text-sm font-medium">Password</label>
              <input
                type="password"
                id="reg-password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-gray-700 text-sm font-medium">Role</label>
              <select
                id="reg-role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white"
                required
              >
                <option value="CUSTOMER">Customer</option>
                <option value="SELLER">Seller</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </Form.Group>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${isLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'
                }`}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}
      </div>

      {/* OTP Modal */}
      <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOtpModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={verifyOtpAndRegister}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
