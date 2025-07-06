import React from 'react';
import { Modal, Card, Button } from 'react-bootstrap';
import './ProductDetailModal.css'; // Create this file for styling

const ProductDetailModal = ({ product, show, onHide }) => {
  if (!product) {
    return null;
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="product-detail-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="product-detail-modal">{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="product-detail-container">
          <div className="product-images">
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            {product.bulkImageUrl && (
              <img src={product.bulkImageUrl} alt={`${product.name} (Bulk)`} className="product-image" />
            )}
          </div>
          <div className="product-info">
            <p>{product.description}</p>
            <p><strong>Price:</strong> {product.price}</p>
            {product.bulkProductPrice && <p><strong>Bulk Price:</strong> {product.bulkProductPrice}</p>}
            <p><strong>Size:</strong> {product.size || 'N/A'}</p>
            <p><strong>From:</strong> {product.from || 'N/A'}</p>
            <p><strong>Material:</strong> {product.material || 'N/A'}</p>
            <Button variant="primary">Add to Cart</Button>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductDetailModal;
