import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import BASE_URL from "../config";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Animation mount effect
  useEffect(() => {
    setMounted(true);
    
    // Verify token exists
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setSuccess('');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setSuccess('');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${BASE_URL}/api/users/reset-password?token=${token}&newPassword=${encodeURIComponent(password)}`,
        {
          method: 'POST',
        }
      );

      const result = await response.text();

      if (response.ok) {
        setSuccess(result || 'Password successfully reset');
        setError('');
        // Redirect to login page after delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(`${result || 'Password reset failed. Please try again.'}`);
        setSuccess('');
      }
    } catch (err) {
      setError('Failed to reset password. Please try again.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        type: "spring",
        stiffness: 120
      }
    }
  };

  return (
    <Container className="py-12 px-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} xl={5} className="mx-auto">
          <motion.div
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
            variants={cardVariants}
          >
            <Card className="border-0 shadow-xl rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 h-2 w-full" />
              <Card.Header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4">
                <h2 className="text-center font-bold text-2xl m-0">Set New Password</h2>
                <p className="text-center text-blue-100 text-sm mt-1 mb-0">
                  Create a strong, secure password
                </p>
              </Card.Header>
              
              <Card.Body className="p-6 pt-7">
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      key="success"
                      variants={successVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <Alert variant="success" className="mb-5 shadow-sm border-l-4 border-green-500">
                        <div className="flex flex-col items-center py-3">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
                            <svg className="w-6 h-6 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <div className="text-green-700 font-medium text-lg mb-2">Success!</div>
                          <p className="mb-1 text-center">Your password has been reset successfully!</p>
                          <p className="text-sm text-gray-600 mt-2">Redirecting you to the login page...</p>
                          <div className="mt-4">
                            <Spinner animation="border" size="sm" className="text-blue-500" />
                          </div>
                        </div>
                      </Alert>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      variants={formVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div variants={itemVariants}>
                        <p className="text-gray-600 text-center mb-6 px-2">
                          Please enter your new password below. Make sure it's at least 8 characters long and includes numbers and special characters for security.
                        </p>
                      </motion.div>
                      
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Alert variant="danger" className="mb-5 shadow-sm border-l-4 border-red-500">
                              <div className="flex items-center py-1">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 mr-3">
                                  <svg className="w-5 h-5 text-red-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                  </svg>
                                </div>
                                <span className="text-red-700">{error}</span>
                              </div>
                            </Alert>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <Form onSubmit={handleSubmit}>
                        <motion.div variants={itemVariants}>
                          <Form.Group className="mb-4" controlId="formPassword">
                            <Form.Label className="font-medium text-gray-700 mb-2 block">New Password</Form.Label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                              </div>
                              <Form.Control
                                type={passwordVisible ? "text" : "password"}
                                placeholder="Enter your new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pl-10 py-3 pr-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 shadow-sm"
                                style={{ paddingLeft: "2.75rem" }}
                              />
                              <div 
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                              >
                                {passwordVisible ? (
                                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path>
                                  </svg>
                                ) : (
                                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                  </svg>
                                )}
                              </div>
                            </div>
                            <div className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</div>
                          </Form.Group>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <Form.Group className="mb-5" controlId="formConfirmPassword">
                            <Form.Label className="font-medium text-gray-700 mb-2 block">Confirm Password</Form.Label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                </svg>
                              </div>
                              <Form.Control
                                type={confirmPasswordVisible ? "text" : "password"}
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="pl-10 py-3 pr-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 shadow-sm"
                                style={{ paddingLeft: "2.75rem" }}
                              />
                              <div 
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                              >
                                {confirmPasswordVisible ? (
                                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path>
                                  </svg>
                                ) : (
                                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                  </svg>
                                )}
                              </div>
                            </div>
                            {password && confirmPassword && password !== confirmPassword && (
                              <div className="mt-1 text-xs text-red-500">Passwords do not match</div>
                            )}
                          </Form.Group>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium transition-all duration-200 focus:ring focus:ring-blue-300 focus:ring-opacity-50 transform hover:-translate-y-1 hover:shadow-md disabled:opacity-70"
                          >
                            {loading ? (
                              <div className="flex justify-center items-center">
                                <Spinner animation="border" size="sm" className="mr-2" />
                                <span>Resetting Password...</span>
                              </div>
                            ) : (
                              'Reset Password'
                            )}
                          </Button>
                        </motion.div>
                      </Form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card.Body>
              
              <Card.Footer className="bg-gray-50 text-center py-4 px-6">
                <motion.p 
                  className="mb-0 text-sm text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  Remembered your password?{' '}
                  <a 
                    href="/login" 
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 relative group"
                  >
                    Back to Login
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </a>
                </motion.p>
              </Card.Footer>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}