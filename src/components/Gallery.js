import React, { useState, useEffect } from 'react';
import './Gallery.css';
import { motion } from 'framer-motion';
import { BACKEND_BASE_URL } from '../config';

const getRandomPosition = () => ({
  x: Math.floor(Math.random() * 300 - 150),
  y: Math.floor(Math.random() * 300 - 150),
});

function Gallery() {
  const [images, setImages] = useState([]);
  const [positions, setPositions] = useState({});
  const [movedImages, setMovedImages] = useState(new Set());

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/gallery`);
        const data = await response.json();
        const urls = data.map((item) => item.imageUrl);
        setImages(urls);

        const initialPositions = {};
        urls.forEach((url) => {
          initialPositions[url] = getRandomPosition();
        });
        setPositions(initialPositions);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      }
    };

    fetchImages();
  }, []);

  const handleDragEnd = (url) => {
    setMovedImages((prev) => {
      const newSet = new Set(prev);
      newSet.add(url);
      return newSet;
    });
  };

  const allMoved = movedImages.size === images.length;

  return (
    <div className="gallery-container">
      <h2 className="gallery-title">Our Gallery</h2>
      <div className="gallery-stack">
        {images.map((url, idx) => (
          <motion.img
            key={url}
            src={url}
            alt={`Gallery-${idx}`}
            className="draggable-image"
            drag
            dragMomentum={false}
            initial={{
              x: positions[url]?.x || 0,
              y: positions[url]?.y || 0,
              rotate: Math.random() * 30 - 15,
            }}
            whileTap={{ scale: 1.05 }}
            onDragEnd={() => handleDragEnd(url)}
          />
        ))}
        {allMoved && (
          <motion.div
            className="quality-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            ✨ Quality previews here ✨
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Gallery;
