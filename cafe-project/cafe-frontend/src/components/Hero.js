import React from 'react';
import './Hero.css';

const caramelImage = process.env.PUBLIC_URL + '/images/caramel.jpg';

const Hero = () => {
  return (
    <section 
      className="hero-section"
      style={{ backgroundImage: `url(${caramelImage})` }}
    >
      <div className="hero-content">
        <div className="hero-text">
          <h className="hero-subtitle">The art of</h>
          <h1 className="hero-title">PAUSE</h1>
        </div>
      </div>
    </section>
  );
};

export default Hero;