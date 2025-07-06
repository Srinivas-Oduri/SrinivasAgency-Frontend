// CartPage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Form, Card } from 'react-bootstrap';
import axios from 'axios';
import './CartPage.css';
import PaymentIntegration from './PaymentIntegration';
import { motion, AnimatePresence } from 'framer-motion';
import { BACKEND_BASE_URL } from '../config';

import { useNavigate } from 'react-router-dom';

function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    altPhone: '',
    pincode: '',
    state: '',
    city: '',
    house: '',
    road: ''
  });

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchAddresses = async () => {
      if (userId) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${BACKEND_BASE_URL}/api/users/${userId}/addresses`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAddresses(response.data);
        } catch (error) {
          console.error('Error fetching addresses:', error);
        }
      }
    };
    fetchAddresses();
  }, [userId, navigate]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (userId) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${BACKEND_BASE_URL}/api/carts/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const filteredItems = response.data.filter(item => item.product !== null);
          setCartItems(filteredItems);
          const qtyObj = {};
          filteredItems.forEach(item => {
            if (item.product && item.product.id) {
              qtyObj[item.product.id] = 1;
            }
          });
          setQuantities(qtyObj);
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }
      }
    };
    fetchCartItems();
  }, [userId]);

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, parseInt(value) || 1)
    }));
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BACKEND_BASE_URL}/api/carts/${userId}/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(prev => prev.filter(item => item.product?.id !== productId));
      setQuantities(prev => {
        const newQ = { ...prev };
        delete newQ[productId];
        return newQ;
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Error removing from cart');
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BACKEND_BASE_URL}/api/carts`, {
        userId: userId,
        productIds: [productId]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(prev => [...prev, { product: response.data.product }]);
      alert('Product added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    const qty = quantities[item.product?.id] || 1;
    return sum + price * qty;
  }, 0);

  const shipping = cartItems.length > 0 ? 5.0 : 0.0;
  const total = subtotal + shipping;

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const cartProductIds = cartItems.map(item => item.product?.id);
        const response = await axios.post(`${BACKEND_BASE_URL.replace('8080', '5000')}/recommend`, {
          cart_contents: cartProductIds,
          user_id: userId
        });
        setRecommendations(response.data.recommendations || []);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };
    if (cartItems.length > 0) fetchRecommendations();
  }, [cartItems, quantities]);

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
    exit: {
      opacity: 0,
      x: 50,
      transition: { ease: "easeInOut" },
    },
  };

  const handleNewAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.id]: e.target.value });
  };

  const handleSaveAddress = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BACKEND_BASE_URL}/api/users/${userId}/addresses`, newAddress, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const response = await axios.get(`${BACKEND_BASE_URL}/api/users/${userId}/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(response.data);
      setNewAddress({
        name: '',
        phone: '',
        altPhone: '',
        pincode: '',
        state: '',
        city: '',
        house: '',
        road: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Error saving address');
    }
  };

  return (
    <Container className="cart-container">
      <h2>Shopping Cart</h2>

      <Table className="cart-table" responsive>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {cartItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">Your cart is empty.</td>
              </tr>
            ) : (
              cartItems.map((item, idx) => (
                <motion.tr
                  key={item.product?.id || idx}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={item.product?.imageUrl || 'https://via.placeholder.com/70'} alt="product" />
                      <div><strong>{item.product?.name}</strong></div>
                    </div>
                  </td>
                  <td>${item.product?.price?.toFixed(2)}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min="1"
                      value={quantities[item.product?.id] || 1}
                      onChange={e => handleQuantityChange(item.product?.id, e.target.value)}
                    />
                  </td>
                  <td>${((item.product?.price || 0) * (quantities[item.product?.id] || 1)).toFixed(2)}</td>
                  <td>
                    <Button variant="danger" onClick={() => handleRemoveFromCart(item.product?.id)}>
                      Remove
                    </Button>
                  </td>
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </tbody>
      </Table>

      <Row>
        <Col md={6}>
          <div className="address-section">
            <h3>Shipping Address</h3>
            {addresses && addresses.length > 0 ? (
              addresses
                .filter(address => address && (address.id || address._id)) // Filter out null/invalid
                .map((address, index) => (
                  <div key={address.id || address._id} style={{ marginBottom: 8 }}>
                    <Form.Check
                      type="radio"
                      id={`address-${index}`}
                      name="address"
                      value={address.id || address._id}
                      onChange={() => setSelectedAddress(address)}
                      checked={
                        selectedAddress &&
                        (selectedAddress.id === (address.id || address._id) ||
                         selectedAddress._id === (address.id || address._id))
                      }
                      label={
                        <span>
                          <strong>{address.name}</strong><br />
                          Phone: {address.phone} {address.altPhone && `| Alt: ${address.altPhone}`}<br />
                          {address.house && `${address.house}, `}
                          {address.road && `${address.road}, `}
                          {address.city && `${address.city}, `}
                          {address.state && `${address.state}, `}
                          {address.pincode}
                        </span>
                      }
                    />
                  </div>
                ))
            ) : (
              <p>No addresses found.</p>
            )}
            {!showForm && (
              <Button variant="primary" onClick={() => setShowForm(true)} className="add-address-btn">
                + Add New Address
              </Button>
            )}
            {showForm && (
              <div className="address-form-container">
  <div className="address-form-title">Add New Address</div>
  <Form className="address-form">
    {["name", "phone", "altPhone", "pincode", "state", "city", "house", "road"].map(field => (
      <Form.Group controlId={field} key={field}>
        <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
        <Form.Control
          type="text"
          placeholder={`Enter ${field}`}
          value={newAddress[field]}
          onChange={handleNewAddressChange}
        />
      </Form.Group>
    ))}
  </Form>
  <div className="form-actions">
    <Button variant="primary" onClick={handleSaveAddress}>Save Address</Button>
    <Button
      variant="secondary"
      onClick={() => {
        setNewAddress({ name: '', phone: '', altPhone: '', pincode: '', state: '', city: '', house: '', road: '' });
        setShowForm(false); // <-- Hide the form
      }}
    >
      Cancel
    </Button>
  </div>
</div>

            )}
          </div>
        </Col>

        <Col md={6}>
          <div className="summary-section">
            <h3>Order Summary</h3>
            <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
            <p><strong>Shipping:</strong> ${shipping.toFixed(2)}</p>
            <h4><strong>Total:</strong> ${total.toFixed(2)}</h4>
            {selectedAddress ? (
              <PaymentIntegration selectedAddress={selectedAddress} cartItems={cartItems} subtotal={subtotal} shipping={shipping} total={total} />
            ) : (
              <p>Please select an address.</p>
            )}
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <h3 className="text-center mt-4">Recommended Products</h3>
          <Row>
            {recommendations.map((product) => (
              <Col md={4} key={product.id}>
                <Card className="card-recommendation">
                  <Card.Img variant="top" src={product.imageUrl || 'https://via.placeholder.com/300'} height={180} style={{ objectFit: 'cover' }} />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>{product.description}</Card.Text>
                    <Button onClick={() => handleAddToCart(product.id)}>Add to Cart</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default CartPage;
