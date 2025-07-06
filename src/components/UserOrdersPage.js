import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Image, Badge, Collapse, Button, ProgressBar } from 'react-bootstrap';
import axios from 'axios';
import './UserOrdersPage.css';

import { useNavigate } from 'react-router-dom';

function UserOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [expandedOrderIds, setExpandedOrderIds] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/orders/user/${userId}`);
        setOrders(response.data);

        const allProductIds = [
          ...new Set(response.data.flatMap(order => order.productIds || []))
        ];
        if (allProductIds.length > 0) {
          const prodRes = await axios.get(`/api/products?ids=${allProductIds.join(',')}`);
          const map = {};
          prodRes.data.forEach(prod => {
            map[prod.id || prod._id] = prod;
          });
          setProductMap(map);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, [userId, navigate]);


  const getAddressSummary = (addressStr) => {
    try {
      const addr = JSON.parse(addressStr);
      return `${addr.name}, ${addr.phone}${addr.altPhone ? ', ' + addr.altPhone : ''}, ${addr.house ? addr.house + ', ' : ''}${addr.road ? addr.road + ', ' : ''}${addr.city ? addr.city + ', ' : ''}${addr.state ? addr.state + ', ' : ''}${addr.pincode ? addr.pincode : ''}`;
    } catch {
      return '';
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const getProgress = (status) => {
    if (!status) return 0;
    switch (status.toLowerCase()) {
      case 'Rejected': return 0;
      case 'accepted': return 25;
      case 'shipped': return 50;
      case 'out for delivery': return 75;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return '🕘';
    switch (status.toLowerCase()) {
      case 'rejected-contact us': return '🔴';
      case 'accepted': return '🟢';
      case 'shipped': return '📦';
      case 'out for delivery': return '🚚';
      case 'delivered': return '✅';
      default: return '🕘';
    }
  };

  return (
    <Container className="user-orders-container">
      <h2 className="page-title">My Orders</h2>
      <Row className="g-4">
        {orders.map((order) => {
          const orderId = order._id || order.id;
          const isExpanded = expandedOrderIds.includes(orderId);
          return (
            <Col md={6} lg={4} key={orderId}>
              <Card className="order-card glassy-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <Badge className="status-icon">{getStatusIcon(order.status)}</Badge>
                      <span className="gold-text ms-2">{order.status}</span>
                    </div>
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => toggleExpand(orderId)}
                    >
                      {isExpanded ? 'Hide Details' : 'View Details'}
                    </Button>
                  </div>

                  <ProgressBar
                    now={getProgress(order.status)}
                    label={`${getProgress(order.status)}%`}
                    variant="warning"
                    className="mb-3 progress-custom"
                  />

                  <div className="d-flex flex-wrap mb-2">
                    {order.productIds?.map(pid => {
                      const prod = productMap[pid];
                      return prod ? (
                        <Image
                          key={pid}
                          src={prod.imageUrl}
                          alt={prod.name}
                          width={50}
                          height={50}
                          rounded
                          className="product-img"
                        />
                      ) : null;
                    })}
                  </div>

                  <Collapse in={isExpanded}>
                    <div>
                      <hr />
                      <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                      <p><strong>Delivery Date:</strong> {order.expectedDeliveryDate || 'N/A'}</p>
                      <p><strong>Payment ID:</strong> {order.paymentId}</p>
                      <p><strong>Total:</strong> <span className="gold-text">${order.paymentCost?.toFixed(2) || '0.00'}</span></p>
                      <p><strong>Address:</strong> {getAddressSummary(order.address)}</p>
                    </div>
                  </Collapse>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default UserOrdersPage;
