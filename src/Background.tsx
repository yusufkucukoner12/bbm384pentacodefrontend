
import React from 'react';

  const Background: React.FC = () => (
    <div style={styles.background}>
      <img
        src="/burger.jpeg"
        style={{ ...styles.image, top: 0, left: 0 }}
        alt="Burger"
      />
      <img
        src="/kuzupirzola.jpg"
        style={{ ...styles.image, top: 0, right: 0 }}
        alt="Kuzu Pirzola"
      />
      <img
        src="/pizza.jpg"
        style={{ ...styles.image, bottom: 0, left: 0 }}
        alt="Pizza"
      />
      <img
        src="/pide.jpeg"
        style={{ ...styles.image, bottom: 0, right: 0 }}
        alt="Pide"
      />
    </div>
  );
  const styles = {
    background: {
      position: 'fixed' as 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#fdffe9',
      overflow: 'hidden',
      zIndex:0, // Keeps the background behind everything
    },
    image: {
      position: 'absolute' as 'absolute',
      width: '50%', // Images cover the corners with a 50% width
      height: '50%', // Images cover the corners with a 50% height
      opacity: 0.1, // Make them semi-transparent
      objectFit: 'cover' as 'cover',
    },
  };
  export default Background;
  