import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const GuestNavbar: React.FC = () => {
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('role');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  return (
    <nav className="w-full bg-yellow-50 shadow-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
        {/* Sağ: Menü */}
        <div className="flex-1 flex justify-end gap-6 items-center">
          <Link
            to="/login"
            className={linkClass(location.pathname === '/login')}
          >
            Giriş Yap
          </Link>
          <Link
            to="/signup"
            className={linkClass(location.pathname === '/signup')}
          >
            Kayıt Ol
          </Link>
          <Link
            to="/admin-login"
            className={linkClass(location.pathname === '/admin-login')}
          >
            Admin Giriş
          </Link>
        </div>
      </div>
    </nav>
  );
};

const linkClass = (active: boolean = false) =>
  `px-4 py-2 rounded-md font-semibold text-red-700 transition-colors duration-200 ${
    active ? 'bg-orange-100' : 'hover:bg-orange-100'
  }`;

export default GuestNavbar;
