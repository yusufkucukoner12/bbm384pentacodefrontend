import React from 'react';

const Background: React.FC = () => (
  <div className="fixed top-0 left-0 w-full h-full bg-[#fdffe9] overflow-hidden z-[0]">
    <img
      src="/burger.jpeg"
      className="absolute top-0 left-0 w-1/2 h-1/2 opacity-10 object-cover"
      alt="Burger"
    />
    <img
      src="/kuzupirzola.jpg"
      className="absolute top-0 right-0 w-1/2 h-1/2 opacity-10 object-cover"
      alt="Kuzu Pirzola"
    />
    <img
      src="/pizza.jpg"
      className="absolute bottom-0 left-0 w-1/2 h-1/2 opacity-10 object-cover"
      alt="Pizza"
    />
    <img
      src="/pide.jpeg"
      className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-10 object-cover"
      alt="Pide"
    />

        {/* Bold Line in the Middle */}
        <div className="absolute top-1/2 left-0 w-full h-32 bg-[#FAB82E] z-[1]"></div>
        </div>
);

export default Background;
