import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useAnimation, useTransform } from "framer-motion";
import "./RollingGallery.css";

const RollingGallery = ({ autoplay = false, pauseOnHover = false, images = [] }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth <= 640);
  const autoplayRef = useRef();

  const rotation = useMotionValue(0);
  const controls = useAnimation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsScreenSmall(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const faceCount = images.length;
  const baseWidth = isScreenSmall ? 250 : 320;
  const radius = baseWidth / (2 * Math.tan(Math.PI / faceCount));
  const transform = useTransform(rotation, (r) => `rotateY(${r}deg)`);

  // Autoplay
  useEffect(() => {
    if (!isMounted || !autoplay || faceCount <= 1) return;
    autoplayRef.current = setInterval(() => {
      const nextRotation = rotation.get() - 360 / faceCount;
      controls.start({
        rotateY: nextRotation,
        transition: { duration: 1.6, ease: "easeInOut" },
      });
      rotation.set(nextRotation);
    }, 3000);

    return () => clearInterval(autoplayRef.current);
  }, [isMounted, autoplay, faceCount]);

  // Drag Handler
  const handleDrag = (_, info) => {
    const newRotation = rotation.get() + info.offset.x * 0.15;
    rotation.set(newRotation);
  };

  const handleDragEnd = (_, info) => {
    if (!isMounted) return;
    const newRotation = rotation.get() + info.velocity.x * 0.05;
    controls.start({
      rotateY: newRotation,
      transition: { type: "spring", stiffness: 60, damping: 18 },
    });
    rotation.set(newRotation);
  };

  const handleMouseEnter = () => {
    if (autoplay && pauseOnHover) clearInterval(autoplayRef.current);
  };

  const handleMouseLeave = () => {
    if (!autoplay || !pauseOnHover || !isMounted) return;
    autoplayRef.current = setInterval(() => {
      const nextRotation = rotation.get() - 360 / faceCount;
      controls.start({
        rotateY: nextRotation,
        transition: { duration: 1.6, ease: "easeInOut" },
      });
      rotation.set(nextRotation);
    }, 3000);
  };

  return (
    <div className="gallery-container">
      <div className="gallery-gradient gallery-gradient-left"></div>
      <div className="gallery-gradient gallery-gradient-right"></div>
      <div className="gallery-content">
        <motion.div
          drag="x"
          className="gallery-track"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            transform,
            rotateY: rotation,
            transformStyle: "preserve-3d",
          }}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={controls}
        >
          {images.map((url, index) => (
            <div
              key={index}
              className="gallery-item"
              style={{
                transform: `rotateY(${index * (360 / faceCount)}deg) translateZ(${radius}px)`,
                width: `${baseWidth}px`,
              }}
            >
              <img src={url} alt={`Gallery ${index}`} className="gallery-img" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default RollingGallery;
