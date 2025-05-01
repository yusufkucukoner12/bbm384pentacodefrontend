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

const mapFromRoleToRoute = (role: string): string => {
  // print
  console.log('Role:', role);
  switch (role) {
    case 'ROLE_CUSTOMER':
      return 'customer';
    case 'ROLE_RESTAURANT':
      return 'restaurant';
    case 'ROLE_COURIER':
      return 'courier';
    case 'ROLE_ADMIN':
      return 'admin';
    default:
      return 'guest';
  }
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const [role, setRole] = useState<string>('guest');
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    // localStorage.removeItem('token');
    // localStorage.removeItem('role');
    if (!savedRole) {

      setRole('guest');
      return;
    }
    console.log('Saved Role:', savedRole);
    const mappedRole = savedRole ? mapFromRoleToRoute(savedRole) : 'guest';
    setRole(mappedRole);
  }, [location]);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('role');
      localStorage.removeItem('token');
      setRole('guest');
      window.location.href = '/login';
    }
  };

  const navItems = routes[role] || routes['guest'];

  return (
    <nav className="w-full bg-orange-50 shadow-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex gap-6 items-center">
          {navItems.map((item) => (
            <div
              key={item.to}
              className="relative"
              onMouseEnter={() => setHovered(item.to)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link
                to={item.to}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.to
                    ? 'text-red-700 border-b-2 border-red-700'
                    : 'text-gray-800 hover:text-red-700 hover:bg-orange-100'
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
                      className="block px-6 py-3 text-sm text-gray-700 hover:text-red-700 hover:bg-orange-100 transition duration-150"
                    >
                      {sub.text}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {role !== 'guest' && (
          <button
            onClick={handleLogout}
            className="text-red-500 font-medium hover:text-red-600 transition duration-150"
          >
            Çıkış Yap
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
