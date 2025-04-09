import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Route tanımı için tip
interface NavItem {
  to: string;
  text: string;
}

// Kullanıcı tiplerine göre route’lar
const routes: Record<string, NavItem[]> = {
  guest: [
    { to: '/login', text: 'Giriş Yap' },
    { to: '/signup', text: 'Kayıt Ol' },
    { to: '/admin-login', text: 'Admin Giriş' },
  ],
  customer: [
    { to: '/customer/main', text: 'Ana Sayfa' },
    { to: '/customer/restaurants', text: 'Restoranlar' },
    { to: '/customer/order', text: 'Sipariş Ver' },
    { to: '/customer/account-management', text: 'Hesabım' },
  ],
  restaurant: [
    { to: '/restaurant/account-management', text: 'Hesap Yönetimi' },
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

// Ana menüler için sabit route’lar
const mainRoutes: NavItem[] = [
  { to: '/login', text: 'Giriş/Kayıt' },
  { to: '/customer/main', text: 'Müşteri' },
  { to: '/restaurant/account-management', text: 'Restoran' },
  { to: '/courier/account-management', text: 'Kurye' },
  { to: '/admin/main', text: 'Admin' },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname.split('/')[1] || ''; // "customer", "restaurant", vs. ya da boş
  const userType = path === '' || path === 'login' || path === 'signup' || path === 'admin-login' ? 'guest' : path;

  // Aktif link kontrolü
  const isActive = (to: string): boolean => location.pathname === to;

  return (
    <nav style={{ padding: '1rem', background: '#f0f0f0' }}>
      {/* Ana Menüler */}
      <div style={{ marginBottom: '1rem' }}>
        {mainRoutes.map((item, index) => (
          <React.Fragment key={item.to}>
            {index > 0 && ' | '}
            <Link
              to={item.to}
              style={{
                fontWeight: isActive(item.to) ? 'bold' : 'normal',
                color: isActive(item.to) ? 'blue' : 'black',
                textDecoration: 'none',
                margin: '0 5px',
              }}
            >
              {item.text}
            </Link>
          </React.Fragment>
        ))}
      </div>

      {/* Alt Menüler */}
      <div>
        {(routes[userType] || routes.guest).map((item, index) => (
          <React.Fragment key={item.to}>
            {index > 0 && ' | '}
            <Link
              to={item.to}
              style={{
                fontWeight: isActive(item.to) ? 'bold' : 'normal',
                color: isActive(item.to) ? 'blue' : 'black',
                textDecoration: 'none',
                margin: '0 5px',
              }}
            >
              {item.text}
            </Link>
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;