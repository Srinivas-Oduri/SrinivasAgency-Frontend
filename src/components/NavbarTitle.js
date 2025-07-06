import React, { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform
} from 'framer-motion';

const letters = 'Srinivasa Agency'.split('');

const NavbarTitle = () => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      className="title-container shine-wrapper py-1"
      style={{ display: "inline-flex", alignItems: "center" }}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Crown image at start */}
      <img
        src="https://i.pinimg.com/736x/76/d9/9d/76d99d5710b6faefdee2e9ab505ad3c1.jpg"
        alt="Royal Crown"
        className="crown-img"
      />
      {letters.map((letter, index) => (
        <DockLetter
          key={index}
          letter={letter}
          mouseX={mouseX}
          index={index}
        />
      ))}
      {/* Crown image at end */}
      <img
        src="https://i.pinimg.com/736x/76/d9/9d/76d99d5710b6faefdee2e9ab505ad3c1.jpg"
        alt="Royal Crown"
        className="crown-img"
      />
    </motion.div>
  );
};

const DockLetter = ({ letter, mouseX, index }) => {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (x) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return 0;
    return x - (bounds.left + bounds.width / 2);
  });

  const scale = useTransform(distance, [-150, 0, 150], [1, 1.8, 1]);
  const y = useTransform(distance, [-150, 0, 150], [0, -30, 0]);

  const animatedScale = useSpring(scale, {
    stiffness: 300,
    damping: 20,
    mass: 0.5,
  });

  const animatedY = useSpring(y, {
    stiffness: 300,
    damping: 20,
    mass: 0.5,
  });

  return (
    <motion.span
      ref={ref}
      style={{ scale: animatedScale, y: animatedY }}
      className="dock-letter"
      variants={letterVariants}
      custom={index}
    >
      {letter === ' ' ? '\u00A0' : letter}
    </motion.span>
  );
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      when: "beforeChildren",
      delayChildren: 0.2
    }
  }
};

const letterVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.8,
  },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
      delay: index * 0.03,
    },
  }),
};

export default NavbarTitle;