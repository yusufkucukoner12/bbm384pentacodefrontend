import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

interface NavItem {
  to: string;
  text: string;
  subpages?: NavItem[];
}

const routes: Record<string, NavItem[]> = {
  guest: [
    { to: '/login', text: 'Giriş Yap' },
    { to: '/signup', text: 'Kayıt Ol' },
    { to: '/admin-login', text: 'Admin Giriş' },
  ],
  customer: [
    { to: '/customer/restaurants', text: 'Restoranlar' },
    { to: '/customer/review-cart', text: 'Sepetim' },
    { to: '/customer/order', text: 'Sipariş Ver' },
    { to: '/customer/account-management', text: 'Hesabım' },
  ],
  restaurant: [
    {
      to: '/restaurant/account-management',
      text: 'Hesap Yönetimi',
      subpages: [
        { to: '/restaurant/account-management/info', text: 'Bilgi' },
        { to: '/restaurant/account-management/security', text: 'Güvenlik' },
      ],
    },
    { to: '/restaurant/menu-management', text: 'Menü Yönetimi' },
    { to: '/restaurant/orders', text: 'Siparişler' },
    { to: '/restaurant/courier-management', text: 'Kurye Yönetimi' },
  ],
  courier: [
    { to: '/courier/account-management', text: 'Hesap Yönetimi' },
    { to: '/courier/assigned-orders', text: 'Atanan Siparişler' },
    { to: '/courier/idle-orders', text: 'Bekleyen Siparişler' },
    { to: '/courier/order-details', text: 'Sipariş Detayları' },
    { to: '/courier/past-orders', text: 'Geçmiş Siparişler' },
  ],
  admin: [
    { to: '/admin/main', text: 'Ana Sayfa' },
    { to: '/admin/courier-management', text: 'Kurye Yönetimi' },
    { to: '/admin/customer-management', text: 'Müşteri Yönetimi' },
    { to: '/admin/delivery-management', text: 'Teslimat Yönetimi' },
    { to: '/admin/restaurant-management', text: 'Restoran Yönetimi' },
    { to: '/admin/review-management', text: 'İnceleme Yönetimi' },
  ],
};

const mainRoutes: NavItem[] = [
  { to: '/login', text: 'Giriş/Kayıt' },
  { to: '/customer/restaurants', text: 'Müşteri' },
  { to: '/restaurant/account-management', text: 'Restoran' },
  { to: '/courier/account-management', text: 'Kurye' },
  { to: '/admin/main', text: 'Admin' },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname.split('/')[1] || '';
  const userType =
    path === '' || path === 'login' || path === 'signup' || path === 'admin-login'
      ? 'guest'
      : path;

  const isActive = (to: string) => location.pathname === to;

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
  
      try {
        const res = await axios.get('/api/auth/validate-token', {
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
          },
        });
  
        setIsLoggedIn(res.status === 200);
      } catch (error) {
        console.error('Token validation error:', error);
        setIsLoggedIn(false);
      }
    };
  
    validateToken();
  }, []);
  

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
  
    try {
      const resp = await axios.post('/api/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`, // Send the token as a Bearer token
          'Content-Type': 'application/json',
        },
      });
  
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setIsLoggedIn(false);

      if (resp.status === 200) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setIsLoggedIn(false);
    }
  };
  

  return (
    <nav className="bg-gray-100 p-4 z-10 fixed top-0 left-0 w-full shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          {mainRoutes.map((item, index) => (
            <React.Fragment key={item.to}>
              {index > 0 && <span className="mx-2 text-gray-500">|</span>}
              <Link
                to={item.to}
                className={`mr-4 no-underline ${isActive(item.to) ? 'text-blue-600 font-bold' : 'text-black font-normal'}`}
              >
                {item.text}
              </Link>
            </React.Fragment>
          ))}
        </div>

        {isLoggedIn && (
          <button 
            onClick={handleLogout} 
            className="text-red-600 font-semibold hover:underline z-20"
            style={{ zIndex: 20 }}
          >
            Çıkış Yap
          </button>
        )}
      </div>
      <div className="flex gap-6 z-10">
        {(routes[userType] || routes.guest).map((item) => (
          <div
            key={item.to}
            className="relative"
            onMouseEnter={() => setHoveredItem(item.to)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              to={item.to}
              className={`no-underline ${isActive(item.to) ? 'text-blue-600 font-bold' : 'text-black font-normal'}`}
            >
              {item.text}
            </Link>

            {item.subpages && (
              <div
                className={`absolute top-full left-0 min-w-[160px] border border-gray-300 bg-white py-2 shadow-md z-10 ${hoveredItem === item.to ? 'block' : 'hidden'}`}
              >
                {item.subpages.map((sub) => (
                  <Link
                    key={sub.to}
                    to={sub.to}
                    className="block px-4 py-2 text-black no-underline hover:bg-gray-100"
                  >
                    {sub.text}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
