import React, { useState } from 'react';
import './Login.css';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BACKEND_BASE_URL } from '../config';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await axios.post(`${BACKEND_BASE_URL}/api/users/signup`, {
        username,
        email,
        password,
      },
      { headers: { 'Content-Type': 'application/json' }});

      // After successful signup, automatically log the user in
      try {
        const loginResponse = await axios.post(`${BACKEND_BASE_URL}/api/authenticate`, {
          email,
          password,
        });

        const token = loginResponse.data.jwt;
        const userId = loginResponse.data.userId; // <-- This must exist!
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId); // <-- This will now be a real value
        navigate('/login'); // Redirect to login page
      } catch (loginErr) {
        setError(loginErr.response?.data?.message || 'Login failed after signup');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="login-bg">
      <motion.div
        className="glass-card login-card"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 60 }}
      >
        <h2 className="login-title text-center mb-4">📝 Signup</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-group" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              className="animated-input"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="form-group" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              className="animated-input"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="form-group" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              className="animated-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="login-btn w-100 mt-3"
          >
            Signup
          </motion.button>
        </Form>
        <div className="login-switch mt-3">
          Already have an account? <a href="/login">Login</a>
        </div>
      </motion.div>
    </div>
  );
}
export default Signup;

