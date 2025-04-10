import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

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
      to: '/customer/main',
      text: 'Ana Sayfa',
      subpages: [
        { to: '/customer/main/profile', text: 'Profil' },
        { to: '/customer/main/settings', text: 'Ayarlar' },
      ],
    },
    { to: '/customer/restaurants', text: 'Restoranlar' },
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
  { to: '/customer/main', text: 'Müşteri' },
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
    <nav style={{ padding: '1rem', background: '#f0f0f0' }}>
      <div>
        {mainRoutes.map((item, index) => (
          <React.Fragment key={item.to}>
            {index > 0 && ' | '}
            <Link
              to={item.to}
              style={{
                textDecoration: 'none',
                color: isActive(item.to) ? 'blue' : 'black',
                fontWeight: isActive(item.to) ? 'bold' : 'normal',
                marginRight: '10px',
              }}
            >
              {item.text}
            </Link>
          </React.Fragment>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '1rem' }}>
        {(routes[userType] || routes.guest).map((item) => (
          <div
            key={item.to}
            style={{ position: 'relative' }}
            onMouseEnter={() => setHoveredItem(item.to)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              to={item.to}
              style={{
                textDecoration: 'none',
                color: isActive(item.to) ? 'blue' : 'black',
                fontWeight: isActive(item.to) ? 'bold' : 'normal',
              }}
            >
              {item.text}
            </Link>

            {item.subpages && (
              <div
                style={{
                  display: hoveredItem === item.to ? 'block' : 'none',
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  background: 'white',
                  border: '1px solid #ccc',
                  padding: '5px 0',
                  minWidth: '160px',
                  zIndex: 10,
                }}
              >
                {item.subpages.map((sub) => (
                  <Link
                    key={sub.to}
                    to={sub.to}
                    style={{
                      display: 'block',
                      padding: '8px 16px',
                      color: 'black',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = '#f0f0f0')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'white')
                    }
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
