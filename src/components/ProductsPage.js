import React, { useState, useEffect, forwardRef } from 'react';
import { Card, Button } from 'react-bootstrap';
import axios from 'axios';
import ProductDetailModal from './ProductDetailModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import './ProductsPage.css';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { BACKEND_BASE_URL } from '../config';

const ProductsPage = forwardRef((props, ref) => {
  const [products, setProducts] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddToWishlist = async (productId, isBulkProduct, event) => {
    event.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    const isFlipped = flippedCards[productId] || false;
    const bulkProduct = isFlipped || isBulkProduct;
    try {
      const userId = localStorage.getItem('userId');
      await axios.post(
        `${BACKEND_BASE_URL}/api/wishlists`,
        { userId, productId, isBulkProduct: bulkProduct },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Product added to wishlist!');
    } catch (error) {
      toast.error('Error adding to wishlist!');
    }
  };

  const handleAddToCart = async (productId, event) => {
    event.stopPropagation(); // Prevent the click event from bubbling up
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    try {
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
  
      toast.success('Product added to cart');
    } catch (error) {
      toast.error('Error adding to cart');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Add the Authorization header
          },
        };
        const response = await axios.get(`${BACKEND_BASE_URL}/api/products`, config);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const toggleCardFlip = (productId) => {
    setFlippedCards((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  const cardVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 15,
      },
    },
  };

  const validProducts = products.filter(
    (product) =>
      product.name &&
      product.imageUrl &&
      product.description &&
      product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
   <div className="products-container" ref={ref} >
      <div className="search-box">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {validProducts.length === 0 && (
        <div className="no-products">
          <h5>No products to display.</h5>
        </div>
      )}

      <div className="products-grid">
        {validProducts.map((product) => (
          <motion.div
            key={product.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className={`product-card ${flippedCards[product.id] ? 'flipped' : ''}`}
          >
            <div className="card-front">
              <Card.Img
                variant="top"
                src={product.imageUrl || 'https://placehold.co/300x200?text=No+Image'}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/300x200?text=No+Image';
                }}
                className="card-img-top"
                onClick={() => {
                  setSelectedProduct(product);
                  setShowModal(true);
                }}
              />
              <Card.Body className="card-body">
                <Card.Title>{product.name}</Card.Title>
                <div className="product-meta">
                  <div><strong>Size :</strong> {product.size || 'N/A'}</div>
                  <div><strong>Material:</strong> {product.material || 'N/A'}</div>
                </div>
                <div className="product-price">
                  <strong>Price:</strong> {product.price}
                </div>
                <div className="product-actions">
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="wishlist-icon"
                    onClick={(event) => handleAddToWishlist(product.id, product.bulkProductPrice > 0, event)}
                  />
                  <Button variant="primary" onClick={(event) => handleAddToCart(product.id, event)}>
                    Add to Cart
                  </Button>
                  <Button variant="secondary" onClick={() => toggleCardFlip(product.id)}>
                    Need in Bulk
                  </Button>
                </div>
              </Card.Body>
            </div>

            <div className="card-back">
              <Card.Img
                variant="top"
                src={product.bulkImageUrl || 'https://placehold.co/300x200?text=No+Image'}
                className="card-img-top"
              />
              <Card.Body className="card-body">
                <Card.Title>{product.name} (Bulk)</Card.Title>
                <div className="product-meta">
                  <div><strong>Size:</strong> {product.size || 'N/A'}</div>
                  <div><strong>Material:</strong> {product.material || 'N/A'}</div>
                </div>
                <div className="product-price">
                  <strong>Price:</strong> {product.bulkProductPrice}
                </div>
                <div className="product-actions">
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="wishlist-icon"
                    onClick={(event) => handleAddToWishlist(product.id, product.bulkProductPrice > 0, event)}
                  />
                  <Button variant="primary" onClick={(event) => handleAddToCart(product.id, event)}>
                    Add to Cart
                  </Button>
                  <Button variant="secondary" onClick={(event) => {event.stopPropagation(); toggleCardFlip(product.id)}}>
                    Back
                  </Button>
                </div>
              </Card.Body>
            </div>
          </motion.div>
        ))}
      </div>
      <ProductDetailModal
        product={selectedProduct}
        show={showModal}
        onHide={() => setShowModal(false)}
      />
    </div>
  );
});

export default ProductsPage;
