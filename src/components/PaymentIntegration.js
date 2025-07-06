import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap';
import axios from 'axios';
import './PaymentIntegration.css';
import phonepeqr from '../images/phonepeQR.jpeg';

function PaymentIntegration({ cartItems, selectedAddress, subtotal, shipping, total }) {
  const [paymentId, setPaymentId] = useState('');
  const userId = localStorage.getItem('userId'); // Or get from auth context

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!paymentId) {
      alert('Please enter your payment ID');
      return;
    }
    if (!selectedAddress) {
      alert('Please select a shipping address');
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      const orderData = {
        userId,
        paymentId,
        address: JSON.stringify(selectedAddress),
        productIds: cartItems.map(item => item.product.id || item.product._id),
        paymentCost: total, // Add payment amount
        status: "pending",  // Default status
        orderDate: new Date().toISOString() // Today's date in ISO format
      };

      const token = localStorage.getItem('token');
      const response = await axios.post('/api/orders', orderData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('Order placed successfully!');
      // Optionally, redirect to orders page or clear cart here
      // window.location.href = '/orders';
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order');
    }
  };

  return (
    <Container className="payment-container">
      <h2>Payment Integration</h2>
      <Row>
        <Col md={6}>
          <h3>UPI QR Code</h3>
          <Image src={phonepeqr} alt="UPI QR Code" fluid />
          <p>Scan the QR code to make a payment.</p>
        </Col>
        <Col md={6}>
          <h3>Enter Payment ID</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formPaymentId">
              <Form.Label>Payment ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your payment ID"
                value={paymentId}
                onChange={(e) => setPaymentId(e.target.value)}
                className="payment-id-input"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit Payment
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default PaymentIntegration;
