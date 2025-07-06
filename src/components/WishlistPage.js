import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './WishlistPage.css';
import { motion, AnimatePresence } from 'framer-motion';
import { BACKEND_BASE_URL } from '../config';

function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const userId = localStorage.getItem('userId'); // Get user ID from localStorage

  useEffect(() => {
    if (userId) { // Check if userId exists
      const fetchWishlistItems = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${BACKEND_BASE_URL}/api/wishlists/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setWishlistItems(response.data);
        } catch (error) {
          console.error('Error fetching wishlist items:', error);
        }
      };

      fetchWishlistItems(); // Call the function here
    }
  }, [userId]);

  const handleRemoveFromWishlist = async (wishlistId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BACKEND_BASE_URL}/api/wishlists/${wishlistId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setWishlistItems(wishlistItems.filter(item => item.wishlistId !== wishlistId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      await axios.post(`${BACKEND_BASE_URL}/api/wishlists`, { userId, productId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Product added to wishlist!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Error adding to wishlist');
    }
  };
  const handleAddToCart = async (productId) => {
  try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      await axios.post(
        `${BACKEND_BASE_URL}/api/carts`,
        { userId: userId, productIds: [productId] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Product added to cart');
    } catch (error) {
      alert('Error adding to cart');
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  return (
    <Container className="wishlist-products-container">
      <h2 className="wishlist-title">My Wishlist</h2>
      <Row className="g-4">
        <AnimatePresence>
          {wishlistItems.length === 0 && (
            <Col>
              <div className="empty-wishlist-message">Your wishlist is empty.</div>
            </Col>
          )}
          {wishlistItems.map((item) => (
            <Col xs={12} sm={6} md={4} lg={3} key={item.wishlistId}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}
              >
                <Card className="wishlist-product-card">
                  <div
                    className="wishlist-img-wrapper"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleProductClick(item.product)}
                  >
                    <Card.Img
                      variant="top"
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="wishlist-product-img"
                    />
                    <Button
                      variant="danger"
                      className="wishlist-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromWishlist(item.wishlistId);
                      }}
                      title="Remove from wishlist"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                  <Card.Body>
                    <Card.Title className="wishlist-product-title">{item.product.name}</Card.Title>
                    <Card.Text className="wishlist-product-desc">{item.product.description}</Card.Text>
                    {item.product.price && (
                      <div className="wishlist-product-price">
                        ₹{Number(item.product.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </div>
                    )}
                    <Button
                      variant="success"
                      className="wishlist-add-cart-btn"
                      onClick={() => handleAddToCart(item.productId)}
                      
                    >
                      Add to Cart
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </AnimatePresence>
      </Row>
      {showModal && selectedProduct && (
  <div className="wishlist-modal-overlay" onClick={handleCloseModal}>
    <div className="wishlist-modal-content" onClick={e => e.stopPropagation()}>
      <button className="wishlist-modal-close" onClick={handleCloseModal}>×</button>
      <div className="wishlist-modal-images">
        <img src={selectedProduct.imageUrl} alt="Normal" className="wishlist-modal-img" />
        <img src={selectedProduct.bulkImageUrl} alt="Bulk" className="wishlist-modal-img" />
      </div>
      <h2>{selectedProduct.name}</h2>
      <p className="wishlist-modal-desc">{selectedProduct.description}</p>
      <div className="wishlist-modal-details">
        <div><b>Price:</b> ₹{selectedProduct.price}</div>
        <div><b>Bulk Price:</b> ₹{selectedProduct.bulkProductPrice}</div>
        <div><b>Size:</b> {selectedProduct.size}</div>
        <div><b>From:</b> {selectedProduct.from}</div>
        <div><b>Material:</b> {selectedProduct.material}</div>
      </div>
    </div>
  </div>
)}
    </Container>
  );
}

export default WishlistPage;
