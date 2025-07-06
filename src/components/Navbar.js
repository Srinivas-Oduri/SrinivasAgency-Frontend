import React, { useState } from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularText from './CircularText';
import {
  faTools,
  faEye,
  faBars,
  faHome,
  faBoxOpen,
  faShoppingCart,
  faHeart,
  faClipboardList,
  faEnvelope,
  faSignInAlt,
  faUserPlus,
  faSignOutAlt,
  faImages
} from '@fortawesome/free-solid-svg-icons';
import NavbarTitle from './NavbarTitle';
import { motion } from 'framer-motion';

const BALL_SIZE = 50;

function NavigationBar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [eyeHovered, setEyeHovered] = useState(false);

  const handleBallClick = () => {
    setShowMenu((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const dropdownItems = [
    { to: "/", icon: faHome, label: "Home" },
    { to: "/products", icon: faBoxOpen, label: "Products" },
    { to: "/cart", icon: faShoppingCart, label: "Cart" },
    { to: "/wishlist", icon: faHeart, label: "Wishlist" },
    { to: "/orders", icon: faClipboardList, label: "Orders" },
     { to: "/gallery", icon: faImages, label: "Gallery" },
    { to: "/contact", icon: faEnvelope, label: "Contact" },
    ...(token
      ? [{ to: "#", icon: faSignOutAlt, label: "Logout", onClick: () => { setShowMenu(false); handleLogout(); } }]
      : [
          { to: "/login", icon: faSignInAlt, label: "Login" },
          { to: "/signup", icon: faUserPlus, label: "Signup" }
        ])
  ];

  return (
    <>
      <Navbar
        expand="lg"
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '1rem 0',
          backgroundColor: '#f8f9fa',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Container
          fluid
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
          {/* Centered Title + Circular Text */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <NavbarTitle />
            <span style={{ width: 24 }} /> {/* Little gap */}
            <div className="circular-text-navbar">
              <CircularText
                text="TRUSTED*SINCE*2017*"
                spinDuration={20}
              />
            </div>
          </div>

          {/* Tools Ball at far right */}
          <motion.div
            style={{
              position: 'absolute',
              right: 40,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: '#343a40',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              cursor: 'pointer',
              zIndex: 999,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              transition: 'none',
            }}
            onClick={handleBallClick}
            onMouseEnter={() => setEyeHovered(true)}
            onMouseLeave={() => setEyeHovered(false)}
            animate={false}
          >
            <motion.span
              animate={{
                scaleY: [1, 1, 0.15, 1],
              }}
              transition={{
                duration: 1.2,
                times: [0, 0.7, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: "easeInOut"
              }}
              style={{ display: 'inline-block' }}
            >
              <FontAwesomeIcon icon={faEye} />
            </motion.span>
            {eyeHovered && (
              <span
                style={{
                  position: 'absolute',
                  top: '110%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#222',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: 6,
                  fontSize: 14,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                  zIndex: 1000,
                  pointerEvents: 'none'
                }}
              >
                Click for menu
              </span>
            )}
          </motion.div>
        </Container>
      </Navbar>

      {/* Tools Menu */}
      {showMenu && (
        <div
          style={{
            position: 'fixed',
            top: '90px',
            right: '40px',
            background: '#111',
            padding: '18px 0',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
            zIndex: 999,
            minWidth: '240px',
            border: '1px solid #222',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {dropdownItems.map((item, idx) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={item.onClick ? item.onClick : () => setShowMenu(false)}
              className="dropdown-link"
              style={{
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 20px",
                textDecoration: "none",
                borderRadius: "8px",
                transition: "background 0.3s, color 0.3s",
                pointerEvents: item.label === "Logout" && !token ? "none" : "auto",
              }}
            >
              <FontAwesomeIcon icon={item.icon} style={{ fontSize: "1.2rem" }} />
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default NavigationBar;
