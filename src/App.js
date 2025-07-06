import React, { useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ProductsPage from './components/ProductsPage';
import WishlistPage from './components/WishlistPage';
import ContactPage from './components/ContactPage';
import CartPage from './components/CartPage';
import UserOrdersPage from './components/UserOrdersPage';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import Gallery from './components/Gallery.js';
import { DraggableCardDemo } from './components/DraggableCardDemo.js';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const productsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (productsRef.current) {
        const productsTop = productsRef.current.offsetTop;
        const scrollPosition = window.pageYOffset;

        if (scrollPosition > productsTop - 50) {
          productsRef.current.classList.add('scrolled');
        } else {
          productsRef.current.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<UserOrdersPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products" element={<ProductsPage ref={productsRef} />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/draggable-card-demo" element={<DraggableCardDemo />} />
          <Route path="/admin" element={

            (localStorage.getItem('userRole') || '').toUpperCase() === 'ADMIN'
              ? <AdminDashboard />
              : <div>Unauthorized</div>
          } />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </div>
    </Router>
  );
}

export default App;
