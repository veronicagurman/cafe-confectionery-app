import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1>PAUSE</h1>
            <p>Кондитерская с историей</p>
          </div>
        </div>
      </section>

      <section className="about-story">
        <div className="container">
          <div className="story-content">
            <h2>Наша история</h2>
            <div className="story-text">
              <p>
                В 2010 году мы открыли небольшую кондитерскую в центре Минска 
                с простой идеей — создавать десерты, которые становятся частью 
                важных моментов жизни.
              </p>
              <p>
                Сегодня PAUSE — это место, где традиционные рецепты встречаются 
                с современными техниками, а каждый десерт рассказывает свою 
                уникальную историю.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-principles">
        <div className="container">
          <h2>Наши принципы</h2>
          <div className="principles-grid">
            <div className="principle-card">
              <div className="principle-icon"></div>
              <h3>Качество</h3>
              <p>Используем только отборные ингредиенты и следим за каждым этапом приготовления</p>
            </div>
            <div className="principle-card">
              <div className="principle-icon"></div>
              <h3>Традиции</h3>
              <p>Сохраняем классические рецепты, проверенные временем</p>
            </div>
            <div className="principle-card">
              <div className="principle-icon"></div>
              <h3>Инновации</h3>
              <p>Постоянно развиваемся и создаем новые вкусовые сочетания</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-team">
        <div className="container">
          <h2>Команда</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo"></div>
              <h3>Анна Петрова</h3>
              <p>Шеф-кондитер</p>
            </div>
            <div className="team-member">
              <div className="member-photo"></div>
              <h3>Мария Иванова</h3>
              <p>Кондитер</p>
            </div>
            <div className="team-member">
              <div className="member-photo"></div>
              <h3>Дмитрий Смирнов</h3>
              <p>Бариста</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;