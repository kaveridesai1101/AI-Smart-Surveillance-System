import React, { useState } from 'react';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import DashboardLayout from './DashboardLayout';
import './index.css';

function App() {
    // strict flow: landing -> login -> dashboard
    const [currentPage, setCurrentPage] = useState('landing');
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);

    const handleGetStarted = () => {
        setCurrentPage('login');
    };

    const handleLogin = (role, id) => {
        setUserRole(role);
        setUserId(id);
        setCurrentPage('dashboard');
    };

    const handleLogout = () => {
        setUserRole(null);
        setCurrentPage('landing');
    };

    return (
        <div className="App">
            {currentPage === 'landing' && (
                <LandingPage onGetStarted={handleGetStarted} />
            )}

            {currentPage === 'login' && (
                <LoginPage onLogin={handleLogin} />
            )}

            {currentPage === 'dashboard' && (
                <DashboardLayout onLogout={handleLogout} userRole={userRole} userId={userId} />
            )}
        </div>
    );
}

export default App;
