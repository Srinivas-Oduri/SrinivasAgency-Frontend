import React, { useRef, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './ContactPage.css';

import emailjs from '@emailjs/browser';

import ownerImg from '../images/gautamdady.jpeg';         // Main founder image
import cofounderImg from '../images/lingambabu.png'; // Co-founder image
import WhatsAppButton from './WhatsAppButton';

function ContactPage() {
  const formRef = useRef();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setSent(false);

    const SERVICE_ID = 'service_noexkui';
    const TEMPLATE_ID = 'template_qsb65i1';
    const PUBLIC_KEY = 'MJvtzw3p_t2vQGhNL';

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY);
      setSent(true);
      formRef.current.reset();
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    }
    setSending(false);
  };

  return (
    <div className="modern-contact-wrapper">
      <div className="contact-image-section">
        <img src={ownerImg} alt="Lingam Srinivas garu" className="contact-image" />
        <div className="owner-name-large">లింగం శ్రీనివాస్ గారు (Founder)</div>
      </div>

      <div className="contact-content-section">
        <div className="contact-header">
          <h1 className="contact-title">Contact Us</h1>
          <div className="cofounder-wrapper">
            <img src={cofounderImg} alt="Co-Founder" className="cofounder-image" />
            <div className="cofounder-text">Lingam Gautam Kumar<br />(Co-Founder)</div>
          </div>
        </div>

        <div className="form-and-info">
          <div className="form-section">
            {sent && <Alert variant="success">Message sent successfully!</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form ref={formRef} onSubmit={handleSend}>
              <Form.Group>
                <Form.Control name="user_name" type="text" placeholder="Full Name" required />
              </Form.Group>
              <Form.Group>
                <Form.Control name="user_email" type="email" placeholder="E-mail" required />
              </Form.Group>
              <Form.Group>
                <Form.Control name="message" as="textarea" rows={3} placeholder="Message" required />
              </Form.Group>
              <Button type="submit" className="send-button" disabled={sending}>
                {sending ? 'Sending...' : 'Contact Us'}
              </Button>
            </Form>
          </div>

          <div className="info-section">
            <h4>Contact</h4>
            <p>gautamlingam@gmail.com</p>
            <p>
               <i className="fas fa-phone-alt" style={{ color: '#25d366', marginRight: '8px' }}></i>
              +91 94400 00000</p>
            <p>
                  <i className="fas fa-phone-alt" style={{ color: '#25d366', marginRight: '8px' }}></i>
              +91 94400 00000</p>
            <h4>Location</h4>
            <p>Santha Market Road Shop No-9<br />Tadepalligudem</p>

            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://www.instagram.com/m.i.r.a.c.l.e__gautam__0708/?hl=en" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <WhatsAppButton />
    </div>
  );
}

export default ContactPage;
