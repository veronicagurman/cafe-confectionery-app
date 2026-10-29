import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        
        <div className="footer-left">
          <img 
            src="/images/logo_lite.svg" 
            alt="PAUSE кондитерская" 
            className="footer-logo"
          />
          <div className="line left-line"></div>
        </div>

        <div className="footer-right">
          <div className="contact-info">
            <p>Республика Беларусь,</p>
            <p>220089 г. Минск, ул. Дзержинского, 95</p>
            <p>pause@gmail.com</p>
          </div>
          <div className="line right-line"></div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="social-icons">
          <a href="#" aria-label="VK">
            <img src="/images/vk.svg" alt="VK" />
          </a>
          <a href="#" aria-label="Telegram">
            <img src="/images/telegram.svg" alt="Telegram" />
          </a>
          <a href="#" aria-label="Instagram">
            <img src="/images/instagram.svg" alt="Instagram" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;