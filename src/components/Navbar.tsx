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
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    const mappedRole = savedRole ? mapFromRoleToRoute(savedRole) : 'guest';
    setRole(mappedRole);
  }, [location]);

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'Kullanıcı';
    setUserName(name);
  }, [role]);

  useEffect(() => {
    if (role === 'customer' && hovered === 'cart') {
      const token = localStorage.getItem('token');
      if (token) {
        axios
          .get('http://localhost:8080/api/customer/get-order', {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            const items = response.data.data.orderItems || [];
            setCartItems(items);
            const total = items.reduce((acc: number, item: any) => {
              const price = item.menu.price ?? 0;
              const quantity = item.quantity ?? 0;
              return acc + price * quantity;
            }, 0);
            setTotalPrice(total);
          })
          .catch((error) => {
            console.error('Error fetching cart details:', error);
          });
      }
    }
  }, [hovered, role]);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.clear();
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

          {role === 'customer' && (
            <div
              className="relative"
              onMouseEnter={() => setHovered('cart')}
              onMouseLeave={() => setHovered(null)}
            >
              <Link
                to="/customer/review-cart"
                className="px-6 py-3 rounded-md text-sm font-medium text-gray-800 hover:text-red-700 hover:bg-orange-100 relative"
              >
                Sepetim
                <span
                  className="absolute bottom-0 right-0 text-xs text-red-700 font-medium"
                  style={{ marginBottom: '-8px', marginRight: '-10px' }}
                >
                  {totalPrice.toFixed(2)} ₺
                </span>
              </Link>

              {hovered === 'cart' && (
                <div className="absolute left-0 mt-2 w-56 bg-white border border-orange-200 shadow-lg rounded-md z-50">
                  <div className="px-4 py-3">
                    <h3 className="text-sm font-semibold">Sepetim</h3>
                    {cartItems.length > 0 ? (
                      cartItems.map((item: any) => (
                        <div key={item.menu.pk} className="flex justify-between py-2">
                          <span className="text-sm">{item.menu.name}</span>
                          <span className="text-sm text-gray-500">
                            {item.quantity} x {item.menu.price} = {(item.menu.price * item.quantity).toFixed(2)} ₺
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Sepetiniz boş.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {role !== 'guest' && (
          <div
            className="relative"
            onMouseEnter={() => setHovered('user')}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="px-4 py-2 rounded-md cursor-pointer text-sm font-medium text-gray-800 hover:text-red-700 hover:bg-orange-100">
              {userName}
            </span>
            {hovered === 'user' && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-orange-200 shadow-lg rounded-md z-50">
                {role === 'customer' && (
                  <Link
                    to="/customer/account-management"
                    className="block px-6 py-3 text-sm text-gray-700 hover:text-red-700 hover:bg-orange-100 transition duration-150"
                  >
                    Hesap Yönetimi
                  </Link>
                )}
                {role === 'restaurant' && (
                  <Link
                    to="/restaurant/account-management"
                    className="block px-6 py-3 text-sm text-gray-700 hover:text-red-700 hover:bg-orange-100 transition duration-150"
                  >
                    Hesap Yönetimi
                  </Link>
                )}
                {role === 'courier' && (
                  <Link
                    to="/courier/account-management"
                    className="block px-6 py-3 text-sm text-gray-700 hover:text-red-700 hover:bg-orange-100 transition duration-150"
                  >
                    Hesap Yönetimi
                  </Link>
                )}
                {role === 'admin' && (
                  <Link
                    to="/admin/account-management"
                    className="block px-6 py-3 text-sm text-gray-700 hover:text-red-700 hover:bg-orange-100 transition duration-150"
                  >
                    Hesap Yönetimi
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-6 py-3 text-sm text-red-500 hover:text-red-700 hover:bg-orange-100 transition duration-150"
                >
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
