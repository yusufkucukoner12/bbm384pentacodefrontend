import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from './public/hurricane.jpg'; // Import your logo

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
    {
      to: '/customer/restaurants',
      text: 'Restoranlar',
      
    }, 
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

  return (
    <nav className="bg-fdffe9 p-4 flex flex-col">
  {/* Top bar: Logo + Hurricane + Main Routes */}
  <div className="flex items-center mb-6">
    {/* Logo */}
    <img src={logo} className="App-logo mr-4" alt="logo" />

    {/* Hurricane Text */}
    <div className="hurricane-text text-xl font-semibold mr-6 flex">
      <span className="hu">HU</span>
      <span className="rricane">RRICANE</span>
    </div>

    {/* Main Route Links */}
    <div className="flex items-center gap-4">
      {mainRoutes.map((item, index) => (
        <React.Fragment key={item.to}>
          {index > 0 && <span className="text-gray-500">|</span>}
          <Link
            to={item.to}
            className={`no-underline ${
              isActive(item.to)
                ? 'text-black font-bold'
                : 'text-black font-normal'
            }`}
          >
            {item.text}
          </Link>
        </React.Fragment>
      ))}
    </div>
  </div>

  

  {/*<div className="w-1/5 bg-orange-800 text-white flex flex-col p-4">
    {(routes[userType] || routes.guest).map((item) => (
      <div
        key={item.to}
        className="relative mb-2"
        onMouseEnter={() => setHoveredItem(item.to)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <Link
          to={item.to}
          className={`block py-2 px-4 bg-orange-600 rounded text-left no-underline ${
            isActive(item.to)
              ? 'text-white font-bold hover:bg-orange-700'
              : 'text-white font-normal hover:bg-orange-700'
          }`}
        >
          {item.text}
        </Link>


        {item.subpages && (
          <div
            className={`absolute top-0 left-full min-w-[160px] border border-gray-300 bg-white py-2 shadow-md z-10 ${
              hoveredItem === item.to ? 'block' : 'hidden'
            }`}
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
  </div>*/}
</nav>

  );
};

export default Navbar;