import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import BASE_URL from "../config";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Animation mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/users/forgot-password?email=${encodeURIComponent(email)}`,
        {}
      );

      if (response.status === 200) {
        setSubmitted(true);
      }
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
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
                <h2 className="text-center font-bold text-2xl m-0">Password Recovery</h2>
                <p className="text-center text-blue-100 text-sm mt-1 mb-0">
                  We'll help you get back into your account
                </p>
              </Card.Header>
              
              <Card.Body className="p-6 pt-7">
                <AnimatePresence mode="wait">
                  {submitted ? (
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
                          <p className="mb-1 text-center">A password reset link has been sent to your email address.</p>
                          <p className="text-sm text-gray-600 mt-2">Please check your inbox and spam folder.</p>
                        </div>
                      </Alert>
                      <div className="text-center mt-6">
                        <Button 
                          variant="outline-secondary"
                          onClick={() => {setSubmitted(false); setEmail('');}}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-all duration-200"
                        >
                          Send another reset link
                        </Button>
                      </div>
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
                          Enter your email address below and we'll send you a link to reset your password.
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
                          <Form.Group className="mb-5" controlId="formBasicEmail">
                            <Form.Label className="font-medium text-gray-700 mb-2 block">Email Address</Form.Label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                              </div>
                              <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-10 py-3 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 shadow-sm"
                                style={{ paddingLeft: "2.75rem" }}
                              />
                            </div>
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
                                <span>Sending...</span>
                              </div>
                            ) : (
                              'Send Reset Link'
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
                  Remember your password?{' '}
                  <a 
                    href="/" 
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