import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Container, Row, Col, Card, Form, Button, Alert, Badge, Spinner, ListGroup,
  Modal, Tab, Nav, InputGroup
} from 'react-bootstrap';
import {
  FaUser, FaEdit, FaLock, FaEnvelope, FaShieldAlt, FaCheckCircle,
  FaTimesCircle, FaCamera, FaHome, FaTrash, FaPlusCircle,
  FaMapMarkerAlt, FaBell, FaCog, FaIdCard
} from 'react-icons/fa';
import CustomNavbar from './CustomNavbar';
import Footer from './Footer';
import BASE_URL from "../config";

const handleButtonClick = async (e) => {
  e.preventDefault();
  alert("button clicked");

  const name = e.target.form.elements.name.value; // get input from form
  const email = JSON.parse(localStorage.getItem('userData'))?.email;
  const token = JSON.parse(localStorage.getItem('token'));

  try {
    const response = await axios.put(
      `${BASE_URL}/api/users/updateprofile`,
      { name, email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Profile updated successfully:", response.data);
    // optionally show success feedback or update UI state here
  } catch (error) {
    console.error("Error updating profile:", error);
    // optionally show error feedback here
  }
};


// API service using pure axios
const ApiService = {

  getToken: () => {
    const token = localStorage.getItem('token');
    return token ? JSON.parse(token) : null;
  },
  getUserData: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  fetchAddresses: async (userId) => {
    const token = ApiService.getToken();
    if (!token) throw new Error('No authentication token found');

    try {
      const response = await axios.get(`${BASE_URL}/address/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error.response?.data || error.message || 'Failed to fetch addresses';
    }
  },

  addAddress: async (addressData) => {
    const token = ApiService.getToken();
    if (!token) throw new Error('No authentication token found');

    try {
      const response = await axios.post(
        `${BASE_URL}/address/add/${addressData.userId}`,
        addressData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding address:', error);
      throw error.response?.data || error.message || 'Failed to add address';
    }
  },

  deleteAddress: async (id) => {
    const token = ApiService.getToken();
    if (!token) throw new Error('No authentication token found');

    try {
      await axios.delete(`${BASE_URL}/address/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return true;
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error.response?.data || error.message || 'Failed to delete address';
    }
  },

  updateProfile: async (userData, formData) => {
    const token = ApiService.getToken();
    if (!token) throw new Error('No authentication token found');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      if (formData.profileImage) {
        formDataToSend.append('image', formData.profileImage);
      }

      const response = await axios.put(
        `${BASE_URL}/api/users/${userData.id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Update local storage with new data
      const updatedUser = { ...userData, ...response.data };
      localStorage.setItem('userData', JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error.response?.data || error.message || 'Failed to update profile';
    }
  },

  changePassword: async (passwordData) => {
    const token = ApiService.getToken();
    if (!token) throw new Error('No authentication token found');

    try {
      const response = await axios.post(
        `${BASE_URL}/api/users/reset-password`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error.response?.data || error.message || 'Failed to change password';
    }
  },

  resendVerification: async (email) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/users/resend-otp`,
        null,
        {
          params: { email },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error resending verification:', error);
      throw error.response?.data || error.message || 'Failed to resend verification email';
    }
  },

  verifyOtp: async (email, otp) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/users/verify-otp`,
        null,
        {
          params: { email, otp },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error.response?.data || error.message || 'Failed to verify OTP';
    }
  }
};

const token = JSON.parse(localStorage.getItem('token'));

// Reusable notification component
const Notification = ({ message, variant, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return message ? (
    <Alert
      variant={variant}
      dismissible
      onClose={onClose}
      className="animate__animated animate__fadeIn"
    >
      {message}
    </Alert>
  ) : null;
};

// Address card component
const AddressCard = ({ address, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(address.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="mb-3 border shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between">
          <div>
            <h6 className="fw-bold mb-2">
              <FaMapMarkerAlt className="text-primary me-2" />
              {address.city}, {address.state}
            </h6>
            <p className="mb-1 text-muted">
              {address.houseNumber}, {address.street}
            </p>
            <p className="mb-0">
              <Badge bg="light" text="dark">{address.pincode}</Badge>
            </p>
          </div>
          <div>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Spinner size="sm" animation="border" /> : <FaTrash />}
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default function ManageProfile() {
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [previewImage, setPreviewImage] = useState(null);
  const [notification, setNotification] = useState({ message: '', variant: 'success' });
  const [isLoading, setIsLoading] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [addressForm, setAddressForm] = useState({
    houseNumber: '', street: '', city: '', state: '', pincode: '', userId: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Load user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = ApiService.getToken();
        if (!token) throw new Error('No authentication token found');

        // Fetch user data from backend
        const response = await axios.get(`${BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const user = response.data;
        setUserData(user);
        setAddressForm(prev => ({ ...prev, userId: user.id }));
        setPreviewImage(user.profileImage
          ? `${BASE_URL}/images/${user.profileImage}`
          : null);

        // Fetch addresses
        const addresses = await ApiService.fetchAddresses(user.id);
        setUserAddresses(addresses);
      } catch (error) {
        showNotification(error.message || 'Failed to load user data', 'danger');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Show notification with auto-dismiss
  const showNotification = useCallback((message, variant = 'success') => {
    setNotification({ message, variant });
  }, []);

  const clearNotification = useCallback(() => {
    setNotification({ message: '', variant: 'success' });
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (formData) => {
    setIsLoading(true);
    try {
      const updatedUser = await ApiService.updateProfile(userData, formData);
      setUserData(updatedUser);
      showNotification('Profile updated successfully!');
    } catch (error) {
      showNotification(error.message || 'Failed to update profile', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file change for profile image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showNotification('Image size should be less than 5MB', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    handleProfileUpdate({
      name: userData.name,
      profileImage: file
    });
  };

  // Handle address form submission
  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const errors = {};
    if (!addressForm.houseNumber.trim()) errors.houseNumber = 'House number is required';
    if (!addressForm.street.trim()) errors.street = 'Street is required';
    if (!addressForm.city.trim()) errors.city = 'City is required';
    if (!addressForm.state.trim()) errors.state = 'State is required';
    if (!addressForm.pincode.trim()) errors.pincode = 'Pincode is required';
    else if (!/^\d{5,6}$/.test(addressForm.pincode)) errors.pincode = 'Invalid pincode format';

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    try {
      await ApiService.addAddress({ ...addressForm, userId: userData.id });
      showNotification('Address added successfully!');
      setAddressForm({
        houseNumber: '', street: '', city: '', state: '', pincode: '', userId: userData.id
      });
      setShowAddressModal(false);

      // Refresh address list
      const addresses = await ApiService.fetchAddresses(userData.id);
      setUserAddresses(addresses);
    } catch (error) {
      showNotification(error.message || 'Failed to add address', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle address deletion
  const handleDeleteAddress = async (id) => {
    try {
      await ApiService.deleteAddress(id);
      const updatedAddresses = userAddresses.filter(addr => addr.id !== id);
      setUserAddresses(updatedAddresses);
      showNotification('Address deleted successfully!');
    } catch (error) {
      showNotification(error.message || 'Failed to delete address', 'danger');
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validation
    const errors = {};
    if (!passwordForm.currentPassword) errors.currentPassword = 'Current password is required';
    if (!passwordForm.newPassword) errors.newPassword = 'New password is required';
    else if (passwordForm.newPassword.length < 8) errors.newPassword = 'Password must be at least 8 characters';
    if (passwordForm.newPassword !== passwordForm.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    try {
      await ApiService.changePassword({
        token: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      showNotification('Password changed successfully!');
      setPasswordForm({
        currentPassword: '', newPassword: '', confirmPassword: ''
      });
      setShowPasswordModal(false);
    } catch (error) {
      showNotification(error.message || 'Failed to change password', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verification email resend
  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      if (!userData?.email) {
        throw new Error("Email not found in user data");
      }

      const response = await ApiService.resendVerification(userData.email);
      showNotification('Verification email resent successfully!', 'success');
      setShowOtpModal(true); // Open OTP modal after successful resend
      setOtp(''); // Clear previous OTP input
    } catch (error) {
      showNotification(error.message || 'Failed to resend verification email', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    setIsLoading(true);
    try {
      if (!userData?.email) {
        throw new Error("Email not found in user data");
      }

      if (otp.length !== 6) {
        throw new Error("Please enter a 6-digit OTP");
      }

      await ApiService.verifyOtp(userData.email, otp);

      // Update user verification status
      const updatedUser = { ...userData, verified: true };
      setUserData(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));

      showNotification('Email verified successfully!', 'success');
      setShowOtpModal(false);
      alert('Email verification successful!');
    } catch (error) {
      showNotification(error.message || 'Invalid OTP, please try again', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !userData) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <CustomNavbar />
      <Container className="my-5 min-vh-100">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="shadow border-0 rounded-3 overflow-hidden mb-4">
              <Card.Header className="bg-gradient-primary text-white py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="mb-0 fs-4 fw-bold bg-amber-300 border-amber-300">Account Management</h2>
                  <Badge bg={userData?.verified ? 'success' : 'warning'} className="px-3 py-2">
                    {userData?.verified ?
                      <><FaCheckCircle size={14} className="me-1" /> Verified</> :
                      <><FaTimesCircle size={14} className="me-1" /> Unverified</>
                    }
                  </Badge>
                </div>
              </Card.Header>

              <Card.Body className="p-0">
                <Row className="g-0">
                  {/* Sidebar navigation */}
                  <Col md={3} className="border-end">
                    <div className="text-center py-4 border-bottom">
                      <div className="position-relative d-inline-block mb-3">
                        <div className="rounded-circle overflow-hidden border shadow" style={{ width: '120px', height: '120px' }}>
                          {previewImage ? (
                            <img src={previewImage} alt="Profile" className="w-100 h-100 object-fit-cover" />
                          ) : (
                            <div className="w-100 h-100 d-flex justify-content-center align-items-center bg-light text-muted">
                              <FaUser size={40} />
                            </div>
                          )}
                        </div>
                        <label className="position-absolute bottom-0 end-0 bg-primary text-white p-2 rounded-circle cursor-pointer">
                          <FaCamera />
                          <input type="file" accept="image/*" className="d-none" onChange={handleFileChange} />
                        </label>
                      </div>
                      <h5 className="mb-1">{userData?.name}</h5>
                      <p className="text-muted mb-0">{userData?.email}</p>
                      <Badge bg="info" className="mt-2 text-capitalize">{userData?.role?.toLowerCase()}</Badge>
                    </div>

                    <Nav variant="pills" className="flex-column p-3" activeKey={activeTab}>
                      <Nav.Item>
                        <Nav.Link
                          eventKey="profile"
                          onClick={() => setActiveTab('profile')}
                          className="d-flex align-items-center"
                        >
                          <FaIdCard className="me-2" /> Profile Information
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          eventKey="addresses"
                          onClick={() => setActiveTab('addresses')}
                          className="d-flex align-items-center"
                        >
                          <FaMapMarkerAlt className="me-2" /> Addresses
                          <Badge bg="primary" className="ms-auto">{userAddresses.length}</Badge>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          eventKey="security"
                          onClick={() => setActiveTab('security')}
                          className="d-flex align-items-center"
                        >
                          <FaShieldAlt className="me-2" /> Security
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>

                  {/* Main content area */}
                  <Col md={9}>
                    <div className="p-4">
                      <Notification
                        message={notification.message}
                        variant={notification.variant}
                        onClose={clearNotification}
                      />

                      <Tab.Content>
                        {/* Profile Tab */}
                        <Tab.Pane active={activeTab === 'profile'}>
                          <h4 className="mb-4">Profile Information</h4>
                          <Form onSubmit={(e) => {
                            e.preventDefault();
                            handleProfileUpdate({
                              name: e.target.elements.name.value,
                              profileImage: null
                            });
                          }}>
                            <Form.Group className="mb-3">
                              <Form.Label>Full Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="name"
                                defaultValue={userData?.name}
                                required
                              />
                            </Form.Group>

                            <Form.Group className="mb-3">
                              <Form.Label>Email Address</Form.Label>
                              <Form.Control
                                type="email"
                                value={userData?.email}
                                disabled
                              />
                              <Form.Text className="text-muted">
                                Email address cannot be changed.
                              </Form.Text>
                            </Form.Group>

                            <Button
                              variant="primary"
                              type="submit"
                              className="mt-2"
                              disabled={isLoading}
                              onClick={handleButtonClick}
                            >
                              {isLoading ? (
                                <>
                                  <Spinner as="span" animation="border" size="sm" /> Updating...
                                </>
                              ) : (
                                <>Update Profile</>
                              )}
                            </Button>


                          </Form>

                          {!userData?.verified && (
                            <Alert variant="warning" className="mt-4">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <FaBell className="me-2" />
                                  Your account is not verified. Please check your email.
                                </div>
                                <Button
                                  variant="outline-warning"
                                  size="sm"
                                  onClick={handleResendVerification}
                                  disabled={isLoading}
                                >
                                  {isLoading ? (
                                    <Spinner as="span" animation="border" size="sm" />
                                  ) : (
                                    'Resend Email'
                                  )}
                                </Button>
                              </div>
                            </Alert>
                          )}
                        </Tab.Pane>

                        {/* Addresses Tab */}
                        <Tab.Pane active={activeTab === 'addresses'}>
                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="mb-0">Saved Addresses</h4>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => setShowAddressModal(true)}
                              disabled={isLoading}
                            >
                              <FaPlusCircle className="me-1" /> Add New Address
                            </Button>
                          </div>

                          {userAddresses.length === 0 ? (
                            <div className="text-center py-5 bg-light rounded">
                              <FaHome size={48} className="text-muted mb-3" />
                              <h5>No addresses found</h5>
                              <p className="text-muted">Add your first address to get started</p>
                              <Button
                                variant="outline-primary"
                                onClick={() => setShowAddressModal(true)}
                                disabled={isLoading}
                              >
                                Add Address
                              </Button>
                            </div>
                          ) : (
                            <Row>
                              {userAddresses.map((address) => (
                                <Col md={6} key={address.id}>
                                  <AddressCard
                                    address={address}
                                    onDelete={handleDeleteAddress}
                                  />
                                </Col>
                              ))}
                            </Row>
                          )}
                        </Tab.Pane>

                        {/* Security Tab */}
                        <Tab.Pane active={activeTab === 'security'}>
                          <h4 className="mb-4">Security Settings</h4>

                          <Card className="mb-4 shadow-sm">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <h5 className="mb-1">Password</h5>
                                  <p className="text-muted mb-0">Change your account password</p>
                                </div>
                                <Button
                                  variant="outline-primary"
                                  onClick={() => setShowPasswordModal(true)}
                                  disabled={isLoading}
                                >
                                  Change Password
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Tab.Pane>
                      </Tab.Content>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Add Address Modal */}
      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddressSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>House Number / Building Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter house number or building name"
                value={addressForm.houseNumber}
                onChange={(e) => setAddressForm({ ...addressForm, houseNumber: e.target.value })}
                isInvalid={!!formErrors.houseNumber}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.houseNumber}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Street / Area</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter street or area"
                value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                isInvalid={!!formErrors.street}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.street}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter city"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    isInvalid={!!formErrors.city}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.city}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter state"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    isInvalid={!!formErrors.state}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.state}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Pincode</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter pincode"
                value={addressForm.pincode}
                onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                isInvalid={!!formErrors.pincode}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.pincode}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="light" onClick={() => setShowAddressModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <><Spinner as="span" animation="border" size="sm" /> Saving...</>
                ) : (
                  <>Save Address</>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordChange}>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type="password"
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  isInvalid={!!formErrors.currentPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.currentPassword}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  isInvalid={!!formErrors.newPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.newPassword}
                </Form.Control.Feedback>
              </InputGroup>
              <Form.Text className="text-muted">
                Password must be at least 8 characters long.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  isInvalid={!!formErrors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.confirmPassword}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="light" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <><Spinner as="span" animation="border" size="sm" /> Updating...</>
                ) : (
                  <>Update Password</>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* OTP Verification Modal */}
      <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Verify Your Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">We've sent a 6-digit OTP to your email. Please enter it below:</p>

          <Form.Group>
            <Form.Label>OTP Code</Form.Label>
            <Form.Control
              type="text"
              value={otp}
              onChange={(e) => {
                // Only allow numbers and limit to 6 digits
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(value);
              }}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
            />
          </Form.Group>

          <div className="mt-3 text-end">
            <Button
              variant="link"
              onClick={handleResendVerification}
              disabled={isLoading}
            >
              Resend OTP
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowOtpModal(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleVerifyOtp}
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              'Verify OTP'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
}