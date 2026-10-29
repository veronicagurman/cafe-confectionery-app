import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryMenu.css';

const CategoryMenu = () => {
  const categories = [
    {
      id: 1,
      name: "Торты",
      description: "сделаем любой день слаще",
      image: "/images/cake.jpg",
      path: "/cakes"
    },
    {
      id: 2,
      name: "Десерты", 
      description: "вкусный финал вашей трапезы",
      image: "/images/dessert.jpg",
      path: "/desserts"
    },
    {
      id: 3,
      name: "Выпечка",
      description: "не только сладкая, но и соленая", 
      image: "/images/bakery.jpg",
      path: "/bakery"
    },
    {
      id: 4,
      name: "Напитки",
      description: "согреем в холод освежим в жару",
      image: "/images/drinks.jpg", 
      path: "/drinks"
    }
  ];

  return (
    <section className="category-menu">
      <div className="container">
        <h2 className="menu-title">Меню</h2>
        <div className="categories-grid">
          {categories.map(category => (
            <Link 
              key={category.id} 
              to={category.path} 
              className="category-card"
            >
              <div className="category-image">
                <img 
                  src={category.image} 
                  alt={category.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="image-placeholder">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-description">{category.description}</p>
                </div>
                <div className="category-overlay">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-description">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
          
          <div className="quote-card">
            <blockquote className="quote">
              "Жизнь неопределенна. 
              <br />Ешь десерт первым"
            </blockquote>
            <cite className="quote-author">Эрнест Хемингуэй</cite>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryMenu;