import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface NavItem {
  to: string;
  text: string;
  subpages?: NavItem[];
}

interface MenuDTO {
  pk: number;
  name: string;
  price: number;
}

interface OrderItemDTO {
  menu: MenuDTO;
  quantity: number;
}

interface RestaurantDTO {
  name: string;
}

interface OrderDTO {
  orderItems: OrderItemDTO[];
  restaurant?: RestaurantDTO;
  totalPrice: number;
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
      subpages: [
        { to: '/customer/restaurants?favourite=true', text: 'Favori Restoranlar' },
        { to: '/customer/restaurants?favourite=false', text: 'Tüm Restoranlar' },
      ],
    },
    {
      to: '/customer/active-orders',
      text: 'Siparişlerim',
      subpages: [
        { to: '/customer/active-orders?old=false', text: 'Aktif Siparişler' },
        { to: '/customer/active-orders?old=true', text: 'Geçmiş Siparişler' },
        { to: '/customer/favorite-orders', text: 'Favori Siparişler' },
      ],
    },
    {
      to: '/customer/tickets',
      text: 'Destek Talepleri',
      subpages: [
        { to: '/customer/tickets?type=solved', text: 'Çözülmüş Talepler' },
        { to: '/customer/tickets?type=unresolved', text: 'Bekleyen Talepler' },
      ],
    },
  ],
  restaurant: [
    { to: '/restaurant/menu-management', text: 'Menü Yönetimi' },
    { to: '/restaurant/orders', text: 'Siparişler' },
    { to: '/restaurant/courier-management', text: 'Kurye Yönetimi' },
    { to: '/restaurant/tickets', text: 'Destek Talepleri' },
  ],
  courier: [
    { to: '/courier/account-management', text: 'Hesap Yönetimi' },
    { to: '/courier/assigned-orders', text: 'Atanan Siparişler' },
    { to: '/courier/idle-orders', text: 'Bekleyen Siparişler' },
    { to: '/courier/past-orders', text: 'Geçmiş Siparişler' },
    { to: '/courier/tickets', text: 'Destek Talepleri' },
  ],
  admin: [
    { to: '/admin/main', text: 'Ana Sayfa' },
    { to: '/admin/courier-management', text: 'Kurye Yönetimi' },
    { to: '/admin/customer-management', text: 'Müşteri Yönetimi' },
    { to: '/admin/delivery-management', text: 'Teslimat Yönetimi' },
    { to: '/admin/restaurant-management', text: 'Restoran Yönetimi' },
    { to: '/admin/review-management', text: 'İnceleme Yönetimi' },
    {
      to: '/admin/tickets',
      text: 'Destek Talepleri',
      subpages: [
        { to: '/admin/tickets?type=customer', text: 'Müşteri Talepleri' },
        { to: '/admin/tickets?type=courier', text: 'Kurye Talepleri' },
        { to: '/admin/tickets?type=restaurant', text: 'Restoran Talepleri' },
      ],
    },
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
  const [cartItems, setCartItems] = useState<OrderItemDTO[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [restaurantName, setRestaurantName] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [currentMoney, setCurrentMoney] = useState<number | null>(null);
  const hideTimeout = useRef<number | null>(null);

  const linkClass = (active: boolean = false) =>
    `px-4 py-2 rounded-md font-semibold text-red-700 transition-colors duration-200 ${
      active ? 'bg-orange-100' : 'hover:bg-orange-100'
    }`;
  const subLinkClass =
    'block px-6 py-3 text-sm text-red-700 hover:text-red-700 hover:bg-orange-100 transition duration-150';

  // Handle mouse enter to clear hide timeout
  const handleMouseEnter = (key: string) => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    setHovered(key);
  };

  // Handle mouse leave to set hide timeout
  const handleMouseLeave = () => {
    hideTimeout.current = window.setTimeout(() => {
      setHovered(null);
    }, 200);
  };

  // Fetch role and username, reset cart for non-customer roles
  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    const newRole = savedRole ? mapFromRoleToRoute(savedRole) : 'guest';
    setRole(newRole);
    setUserName(localStorage.getItem('userName') || 'Kullanıcı');
    if (newRole !== 'customer') {
      setCartItems([]);
      setTotalPrice(0);
      setRestaurantName('');
    }
  }, [location]);

  // Fetch current money for customer role
  useEffect(() => {
    if (role === 'customer') {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Oturum açma hatası');
        return;
      }
      axios
        .get('http://localhost:8080/api/customer/current-money', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
          if (res.data.code === 200 && typeof res.data.data === 'number') {
            setCurrentMoney(res.data.data);
          } else {
            throw new Error('Invalid response format');
          }
        })
        .catch(err => {
          console.error(err);
          setCurrentMoney(null);
          toast.error('Bakiye yüklenemedi');
        });
    } else {
      setCurrentMoney(null);
    }
  }, [role]);

  // Fetch cart items when cart is hovered
  useEffect(() => {
    if (role === 'customer' && hovered === 'cart') {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Oturum açma hatası');
        return;
      }
      axios
        .get('http://localhost:8080/api/customer/get-order', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
          const order: OrderDTO = res.data.data || {};
          const items = order.orderItems || [];
          setCartItems(items);
          setRestaurantName(order.restaurant?.name || 'Restoran');
          setTotalPrice(
            items.reduce(
              (sum: number, item: OrderItemDTO) => sum + (item.menu.price || 0) * (item.quantity || 0),
              0
            )
          );
        })
        .catch(err => {
          console.error(err);
          toast.error('Sepet yüklenemedi');
          setCartItems([]);
          setRestaurantName('');
          setTotalPrice(0);
        });
    }
  }, [hovered, role]);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.clear();
      setRole('guest');
      setCurrentMoney(null);
      setCartItems([]);
      setTotalPrice(0);
      setRestaurantName('');
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
                {role === 'customer' && (
                  <span
                    className="absolute bottom-0 right-0 text-xs text-red-700 font-medium"
                    style={{ marginBottom: '-10px', marginRight: '-10px' }}
                  >
                    {totalPrice.toFixed(2)} ₺
                  </span>
                )}
              </Link>
              {hovered === 'cart' && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-white border border-orange-200 shadow-lg rounded-md z-50 px-4 py-4"
                  onMouseEnter={() => handleMouseEnter('cart')}
                  onMouseLeave={handleMouseLeave}
                >
                  <h3 className="font-semibold text-red-700 mb-2">Sepetim</h3>
                  {cartItems.length > 0 ? (
                    <>
                      <p className="text-sm text-amber-800 mb-2">Restoran: {restaurantName}</p>
                      {cartItems.map(item => (
                        <div
                          key={item.menu.pk}
                          className="flex justify-between items-center py-2 border-b border-orange-100"
                        >
                          <div className="flex-1">
                            <span className="text-sm text-amber-800">
                              x{item.quantity} {item.menu.name}
                            </span>
                          </div>
                          <div className="text-sm text-red-700 text-right">
                            <span>{item.menu.price.toFixed(2)} ₺ x {item.quantity}</span>
                            <br />
                            <span className="font-semibold">
                              {(item.menu.price * item.quantity).toFixed(2)} ₺
                            </span>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm font-semibold text-amber-800">Toplam:</span>
                        <span className="text-sm font-bold text-red-700">{totalPrice.toFixed(2)} ₺</span>
                      </div>
                      <Link
                        to="/customer/review-cart"
                        className="block mt-3 px-4 py-2 bg-amber-800 text-white text-center rounded hover:bg-amber-900 transition"
                      >
                        Sepete Git
                      </Link>
                    </>
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
                  {role === 'customer' && (
                    <div className="px-6 py-3 text-sm text-red-700">
                      Bakiye: {currentMoney !== null ? `${currentMoney.toFixed(2)} ₺` : 'Yükleniyor...'}
                    </div>
                  )}
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
                  <button onClick={handleLogout} className={subLinkClass}>
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </nav>
  );
};

export default Navbar;