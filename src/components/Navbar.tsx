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
    { to: '/admin/courier-management', text: 'Kurye' },
    { to: '/admin/customer-management', text: 'Müşteri' },
    { to: '/admin/delivery-management', text: 'Teslimat' },
    { to: '/admin/restaurant-management', text: 'Restoran' },
    { to: '/admin/review-management', text: 'İnceleme' },
  ],
};

const mapFromRoleToRoute = (role: string): string => {
  switch (role) {
    case 'ROLE_CUSTOMER': return 'customer';
    case 'ROLE_RESTAURANT': return 'restaurant';
    case 'ROLE_COURIER': return 'courier';
    case 'ROLE_ADMIN': return 'admin';
    default: return 'guest';
  }
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const [role, setRole] = useState<string>('guest');
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    const mappedRole = savedRole ? mapFromRoleToRoute(savedRole) : 'guest';
    setRole(mappedRole);
  }, [location]);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('role');
      localStorage.removeItem('token');
      setRole('guest');
      window.location.href = '/login';
    }
  };

  const navItems = routes[role] || [];

  return (
    <div className="flex items-center p-4 bg-yellow-50 shadow sticky top-0 z-50">
      {/* Left Links */}
      <div className="flex items-center gap-6 flex-1">
        {navItems.slice(0, Math.ceil(navItems.length / 2)).map((item) => (
          <div key={item.to} className="relative"
            onMouseEnter={() => setHovered(item.to)}
            onMouseLeave={() => setHovered(null)}
          >
            <Link
              to={item.to}
              className={`text-lg font-semibold text-orange-700 hover:text-orange-900 ${
                location.pathname === item.to ? 'underline' : ''
              }`}
            >
              {item.text}
            </Link>
            {item.subpages && hovered === item.to && (
              <div className="absolute left-0 mt-2 w-56 bg-white border border-orange-200 shadow-lg rounded-md z-50">
                {item.subpages.map((sub) => (
                  <Link
                    key={sub.to}
                    to={sub.to}
                    className="block px-4 py-2 text-sm text-gray-700 hover:text-red-700 hover:bg-orange-100"
                  >
                    {sub.text}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Logo + Title */}
      <div className="flex items-center gap-2">
        <img src="/hurricane_image.png" alt="Logo" className="w-10 h-10" />
        <h1 className="text-2xl font-bold text-orange-600">HURRICANE</h1>
      </div>

      {/* Right Links + Logout */}
      <div className="flex items-center gap-6 flex-1 justify-end">
        {navItems.slice(Math.ceil(navItems.length / 2)).map((item) => (
          <div key={item.to} className="relative"
            onMouseEnter={() => setHovered(item.to)}
            onMouseLeave={() => setHovered(null)}
          >
            <Link
              to={item.to}
              className={`text-lg font-semibold text-orange-700 hover:text-orange-900 ${
                location.pathname === item.to ? 'underline' : ''
              }`}
            >
              {item.text}
            </Link>
            {item.subpages && hovered === item.to && (
              <div className="absolute left-0 mt-2 w-56 bg-white border border-orange-200 shadow-lg rounded-md z-50">
                {item.subpages.map((sub) => (
                  <Link
                    key={sub.to}
                    to={sub.to}
                    className="block px-4 py-2 text-sm text-gray-700 hover:text-red-700 hover:bg-orange-100"
                  >
                    {sub.text}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {role !== 'guest' && (
          <button
            onClick={handleLogout}
            className="bg-orange-700 text-white px-4 py-2 rounded hover:bg-orange-800"
          >
            Çıkış Yap
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
