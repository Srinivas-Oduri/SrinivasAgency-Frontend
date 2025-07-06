import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './ServicesSection.css';
import { motion } from 'framer-motion';

function ServicesSection() {
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
  };

  return (
    <Container className="services-container">
      <h2>Our Services</h2>
      <Row>
        <Col md={4}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
          <Card className="service-card">
            <Card.Img variant="top" src="https://via.placeholder.com/150x100/007bff/ffffff?text=Delivery" />
            <Card.Body>
              <Card.Title>Fast Delivery</Card.Title>
              <Card.Text>We offer fast and reliable delivery services to ensure your products arrive on time.</Card.Text>
            </Card.Body>
          </Card>
          </motion.div>
        </Col>
        <Col md={4}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
          <Card className="service-card">
            <Card.Img variant="top" src="https://via.placeholder.com/150x100/28a745/ffffff?text=Packaging" />
            <Card.Body>
              <Card.Title>Secure Packaging</Card.Title>
              <Card.Text>Your products are packaged securely to prevent damage during shipping.</Card.Text>
            </Card.Body>
          </Card>
          </motion.div>
        </Col>
        <Col md={4}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
          <Card className="service-card">
            <Card.Img variant="top" src="https://via.placeholder.com/150x100/dc3545/ffffff?text=Support" />
            <Card.Body>
              <Card.Title>Customer Service</Card.Title>
              <Card.Text>Our dedicated customer service team is available to assist you with any questions or concerns.</Card.Text>
            </Card.Body>
          </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}

export default ServicesSection;
