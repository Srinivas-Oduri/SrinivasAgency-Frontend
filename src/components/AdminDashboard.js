import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Table, Card } from 'react-bootstrap';
import axios from 'axios';
import './AdminDashboard.css';
import { motion } from 'framer-motion';
import { BACKEND_BASE_URL } from '../config';

function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', imageUrl: '', price: 0 });
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        setToken(localStorage.getItem('token'));
    }, []);

    useEffect(() => {
        if (token) {
            fetchProducts();
            fetchOrders();
        }
    }, [token]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${BACKEND_BASE_URL}/api/products`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProducts(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${BACKEND_BASE_URL}/api/admin/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOrders(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleInputChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BACKEND_BASE_URL}/api/admin/products`, newProduct, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Product added successfully!');
            setNewProduct({ name: '', description: '', imageUrl: '', price: 0 });
            fetchProducts();
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Error adding product');
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`${BACKEND_BASE_URL}/api/admin/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Product deleted successfully!');
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product');
        }
    };

    const handleUpdateOrderStatus = async (orderId, status, deliveryDate) => {
        try {
            await axios.put(`${BACKEND_BASE_URL}/api/admin/orders/${orderId}?status=${status}&deliveryDate=${deliveryDate}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Order status updated successfully!');
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Error updating order status');
        }
    };

    const formVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 80,
                damping: 10,
            },
        },
    };

    const rowVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: "spring", stiffness: 80, damping: 10 },
        },
    };

    return (
        <Container className="admin-dashboard">
            <h1>Admin Dashboard</h1>

            <h2>Add Product</h2>
<motion.div
    variants={formVariants}
    initial="hidden"
    animate="visible"
>
<div className="card-section">
    <Form onSubmit={handleAddProduct}>
        <Row className="mb-3">
            <Col md={6}>
                <Form.Group controlId="formProductName">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter product name"
                        name="name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                    />
                </Form.Group>
            </Col>

            <Col md={6}>
                <Form.Group controlId="formProductPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter price"
                        name="price"
                        value={newProduct.price}
                        onChange={handleInputChange}
                    />
                </Form.Group>
            </Col>
        </Row>

        <Row className="mb-3">
            <Col md={6}>
                <Form.Group controlId="formProductImageUrl">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter image URL"
                        name="imageUrl"
                        value={newProduct.imageUrl}
                        onChange={handleInputChange}
                    />
                </Form.Group>
            </Col>

            <Col md={6}>
                <Form.Group controlId="formProductDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={1}
                        placeholder="Enter product description"
                        name="description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                    />
                </Form.Group>
            </Col>
        </Row>

        <Button variant="primary" type="submit">
            Add Product
        </Button>
    </Form>
</div>

</motion.div>

  

            <h2>Products</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Image URL</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {(Array.isArray(products) ? products : []).map(product => (
                        <motion.tr key={product.id}
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>${product.price}</td>
                            <td>{product.imageUrl}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </Table>

            <h2>Orders</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>User ID</th>
                        <th>Product IDs</th>
                        <th>Address</th>
                        <th>Payment ID</th>
                        <th>Status</th>
                        <th>Expected Delivery Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {(Array.isArray(orders) ? orders : []).map(order => (
                        <motion.tr key={order.id}
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <td>{order.id}</td>
                            <td>{order.userId}</td>
                            <td>{order.productIds ? order.productIds.join(', ') : ''}</td>
                            <td>{order.address}</td>
                            <td>{order.paymentId}</td>
                            <td>{order.status}</td>
                            <td>{order.expectedDeliveryDate}</td>
            <td>
                <Form.Select
                    value={order.status}
                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value, order.expectedDeliveryDate)}
                >
                    
                    <option value="pending">accept</option>
                    <option value="shipped">Shipped</option>
                    <option value="out for delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="Rejected-Contact us">Reject</option>
                </Form.Select>
            </td>
            <td>
                <Form.Control
                    type="date"
                    value={order.expectedDeliveryDate || ''}
                    onChange={(e) => handleUpdateOrderStatus(order.id, order.status, e.target.value)}
                />
            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default AdminDashboard;
