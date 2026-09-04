// src/pages/HomePage.jsx

import MainLayout from '../layouts/MainLayout';

const HomePage = () => {
  return (
    <MainLayout>
      <section className="hero">
        <h1 className="hero__title">Welcome to Mini Hakathon</h1>
        <p className="hero__subtitle">Build. Ship. Win.</p>
      </section>
    </MainLayout>
  );
};

export default HomePage;
