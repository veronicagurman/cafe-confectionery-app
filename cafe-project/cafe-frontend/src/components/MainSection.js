import React from 'react';
import Hero from './Hero';
import CategoryMenu from './CategoryMenu';
import './MainSection.css';

const MainSection = () => {
  return (
    <div className="main-container">
      <Hero />
      <CategoryMenu />
    </div>
  );
};

export default MainSection;