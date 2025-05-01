import React from 'react';

const Background: React.FC = () => (
  <div className="fixed top-0 left-0 w-full h-full bg-orange-50 overflow-hidden z-0">
    <img
      src="/burger.jpeg"
      className="absolute top-0 left-0 w-full md:w-1/2 h-full opacity-30 object-cover transition-opacity duration-300 ease-in-out hover:opacity-60"
      alt="Burger"
    />
    <img
      src="/kuzupirzola.jpg"
      className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-30 object-cover transition-opacity duration-300 ease-in-out hover:opacity-60"
      alt="Kuzu Pirzola"
    />
    <img
      src="/pizza.jpg"
      className="absolute bottom-0 left-0 w-full md:w-1/2 h-full opacity-30 object-cover transition-opacity duration-300 ease-in-out hover:opacity-60"
      alt="Pizza"
    />
    <img
      src="/pide.jpeg"
      className="absolute bottom-0 right-0 w-full md:w-1/2 h-full opacity-30 object-cover transition-opacity duration-300 ease-in-out hover:opacity-60"
      alt="Pide"
    />

    <div className="absolute top-1/2 left-0 w-full h-32 bg-[#FAB82E] opacity-70 z-1"></div>
  </div>
);

export default Background;
