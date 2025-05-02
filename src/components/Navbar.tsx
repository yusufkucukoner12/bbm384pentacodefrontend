import React, { useEffect, useState, useRef } from 'react';
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
    {
      to: '/customer/active-orders',
      text: 'Siparişlerim',
      subpages: [
        { to: '/customer/active-orders?old=false', text: 'Aktif Siparişler' },
        { to: '/customer/active-orders?old=true', text: 'Geçmiş Siparişler' },
      ],
    },
  ],
  restaurant: [
    { to: '/restaurant/menu-management', text: 'Menü Yönetimi' },
    { to: '/restaurant/orders', text: 'Siparişler' },
    { to: '/restaurant/courier-management', text: 'Kurye Yönetimi' },
  ],
  courier: [
    { to: '/courier/account-management', text: 'Hesap Yönetimi' },
    { to: '/courier/assigned-orders', text: 'Atanan Siparişler' },
    { to: '/courier/idle-orders', text: 'Bekleyen Siparişler' },
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
  switch (role) {
    case 'ROLE_CUSTOMER':   return 'customer';
    case 'ROLE_RESTAURANT': return 'restaurant';
    case 'ROLE_COURIER':    return 'courier';
    case 'ROLE_ADMIN':      return 'admin';
    default:                return 'guest';
  }
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const [role, setRole] = useState<string>('guest');
  const [hovered, setHovered] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');
  const hideTimeout = useRef<number | null>(null);

  const linkClass = (active: boolean = false) =>
    `px-4 py-2 rounded-md font-semibold text-red-700 transition-colors duration-200 ${
      active ? 'bg-orange-100' : 'hover:bg-orange-100'
    }`;
  const subLinkClass =
    'block px-6 py-3 text-sm text-red-700 hover:text-red-700 hover:bg-orange-100 transition duration-150';

  // Whenever you enter a trigger, clear any pending hide:
  const handleMouseEnter = (key: string) => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    setHovered(key);
  };

  // When you leave, wait 200ms before hiding:
  const handleMouseLeave = () => {
    hideTimeout.current = window.setTimeout(() => {
      setHovered(null);
    }, 200);
  };

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    setRole(savedRole ? mapFromRoleToRoute(savedRole) : 'guest');
  }, [location]);

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || 'Kullanıcı');
  }, [role]);

  useEffect(() => {
    if (role === 'customer' && hovered === 'cart') {
      const token = localStorage.getItem('token');
      if (!token) return;
      axios
        .get('http://localhost:8080/api/customer/get-order', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
          const items = res.data.data.orderItems || [];
          setCartItems(items);
          setTotalPrice(
            items.reduce(
              (sum: number, it: any) => sum + (it.menu.price ?? 0) * (it.quantity ?? 0),
              0
            )
          );
        })
        .catch(console.error);
    }
  }, [hovered, role]);

  const handleLogout = async () => {
    try { await axios.post('/api/auth/logout'); } catch (e) { console.error(e); }
    finally {
      localStorage.clear();
      setRole('guest');
      window.location.href = '/login';
    }
  };

  const navItems = routes[role] || routes['guest'];

  return (
    <nav className="w-full bg-orange-50 shadow-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
        {/* Left: nav links */}
        <div className="flex-1 flex gap-6 items-center">
          {navItems.map(item => (
            <div
              key={item.to}
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.to)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to={item.to}
                className={linkClass(location.pathname === item.to)}
              >
                {item.text}
              </Link>
              {item.subpages && hovered === item.to && (
                <div
                  className="absolute left-0 mt-2 w-56 bg-white border border-orange-200 shadow-lg rounded-md z-50"
                  onMouseEnter={() => handleMouseEnter(item.to)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.subpages.map(sub => (
                    <Link key={sub.to} to={sub.to} className={subLinkClass}>
                      {sub.text}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Middle: logo */}
        <div className="flex-1 flex items-center justify-center">
          <img src="/hurricane_image.png" alt="Logo" className="h-12 w-12" />
          <span className="ml-2 text-xl font-bold text-orange-600">
            HURRICANE
          </span>
        </div>

        {/* Right: cart & user/logout */}
        <div className="flex-1 flex justify-end items-center gap-6">
          {role === 'customer' && (
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('cart')}
              onMouseLeave={handleMouseLeave}
            >
              <Link to="/customer/review-cart" className={linkClass()}>
                Sepetim
                <span
                  className="absolute bottom-0 right-0 text-xs text-red-700 font-medium"
                  style={{ marginBottom: '-10px', marginRight: '-10px' }}
                >
                  {totalPrice.toFixed(2)} ₺
                </span>
              </Link>
              {hovered === 'cart' && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-orange-200 shadow-lg rounded-md z-50 px-4 py-4"
                  onMouseEnter={() => handleMouseEnter('cart')}
                  onMouseLeave={handleMouseLeave}
                >
                  <h3 className="font-semibold">Sepetim</h3>
                  {cartItems.length > 0 ? (
                    cartItems.map(item => (
                      <div
                        key={item.menu.pk}
                        className="flex justify-between py-2"
                      >
                        <span className="text-sm">{item.menu.name}</span>
                        <span className="text-sm text-red-700">
                          {item.quantity} x {item.menu.price} ={' '}
                          {(item.menu.price * item.quantity).toFixed(2)} ₺
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-red-700">Sepetiniz boş.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {role !== 'guest' && (
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('user')}
              onMouseLeave={handleMouseLeave}
            >
              <span className={linkClass()}>
                {userName}
                <span className="inline-block ml-2">…</span>
              </span>
              {hovered === 'user' && (
                <div
                  className="absolute right-0 mt-2 w-40 bg-white border border-orange-200 shadow-lg rounded-md z-50"
                  onMouseEnter={() => handleMouseEnter('user')}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Account links */}
                  {['customer', 'restaurant', 'courier', 'admin'].map(r =>
                    role === r ? (
                      <Link
                        key={r}
                        to={`/${r}/account-management`}
                        className={subLinkClass}
                      >
                        Hesap Yönetimi
                      </Link>
                    ) : null
                  )}
                  {/* Logout */}
                  <button onClick={handleLogout} className={subLinkClass}>
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
