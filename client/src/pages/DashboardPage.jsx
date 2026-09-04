// src/pages/DashboardPage.jsx

import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../hooks/useAuth';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <section className="dashboard">
        <h1>Welcome back, {user?.name} 👋</h1>
        <p>You are viewing your dashboard.</p>
      </section>
    </MainLayout>
  );
};

export default DashboardPage;
