import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import UsersManagement from './pages/UsersManagement';
import Services from './pages/Services';
import PostManagement from './pages/PostManagement';
import Sidebar from './components/Sidebar';
import { ToastContainer } from 'react-toastify';
import LogoutPage from './pages/LogoutPage';

function App() {
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLanding(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const PageWithSidebar = ({ children }) => (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );

  if (showLanding) {
    return <LandingPage />;
  }

  return (
    <Router>
       <ToastContainer />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<PageWithSidebar><Dashboard /></PageWithSidebar>} />
        <Route path="/categories" element={<PageWithSidebar><Categories /></PageWithSidebar>} />
        <Route path="/services" element={<PageWithSidebar><Services /></PageWithSidebar>} />
        <Route path="/posts" element={<PageWithSidebar><PostManagement /></PageWithSidebar>} />
        <Route path="/users" element={<PageWithSidebar><UsersManagement /></PageWithSidebar>} />
        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
