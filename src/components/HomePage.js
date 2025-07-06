import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa'; // You may need to install react-icons
import CircularText from './CircularText';
import visit from '../images/sagencyvisit.jpeg';

function HomePage() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const translateY = Math.min(scrollPosition, window.innerHeight);
      const productsDiv = document.querySelector('.products');

      if (productsDiv) {
        productsDiv.style.transform = `translateY(${translateY}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Animation variants
  const cartVariants = {
    initial: { x: 0, scale: 1, opacity: 1 },
    back: {
      x: '-60px',
      scale: 1.05,
      transition: { type: 'spring', stiffness: 300, damping: 18, duration: 5.0 }
    },
    move: {
      x: '120vw',
      scale: 0.7,
      opacity: 0.5,
      transition: { type: 'spring', stiffness: 120, damping: 20, duration: 5.0 } // Slower move
    }
  };

  const blurVariants = {
    visible: { filter: 'blur(10px)', pointerEvents: 'auto' },
    hidden: { filter: 'blur(0px)', pointerEvents: 'none' }
  };

  const [cartMoving, setCartMoving] = useState(false);
  const [cartBack, setCartBack] = useState(false);

  const handleIntroClick = () => {
    setCartBack(true);
    setTimeout(() => {
      setCartMoving(true);
      setTimeout(() => setShowIntro(false), 700); // Remove blur as soon as cart leaves
    }, 180); // Match back animation duration
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1.5 },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 0.5 },
    },
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="intro-overlay"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            style={{
              position: 'fixed',
              zIndex: 9999,
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              cursor: 'pointer'
            }}
            onClick={handleIntroClick}
          >
            <motion.div
              variants={cartVariants}
              initial="initial"
              animate={cartMoving ? "move" : cartBack ? "back" : "initial"}
              style={{
                fontSize: '12rem',
                color: '#f9d536',
                filter: 'drop-shadow(0 4px 32px #0008)'
              }}
            >
              <FaShoppingCart />
            </motion.div>
            {/* <div style={{ color: '#fff', marginTop: 32, fontSize: 24, fontWeight: 600, textShadow: '0 2px 8px #000' }}>
              Let's gooooo
            </div> */}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="home-container"
        variants={blurVariants}
        animate={showIntro ? "visible" : "hidden"}
        transition={{ duration: 0.2 }} // Faster unblur (was 0.5)
        style={{ minHeight: '100vh' }}
      >
        <div className="home-image">
          <img src={visit} alt="Background" />
          {/* <div className="circular-text-top-right home-circular-text">
            <CircularText
              text="TRUSTED*SINCE*2017*"
              onHover="speedUp"
              spinDuration={20}
            />
          </div> */}
        </div>
      </motion.div>
    </div>
  );
}

export default HomePage;
