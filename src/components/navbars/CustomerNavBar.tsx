import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const CustomerNavbar: React.FC = () => {
  const location = useLocation();
  const [hovered, setHovered] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    if (hovered === 'cart') {
      const token = localStorage.getItem('token');
      if (token) {
        axios
          .get('http://localhost:8080/api/customer/get-order', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            const items = response.data.data.orderItems || [];
            setCartItems(items);
            const total = items.reduce((acc: number, item: any) => {
              return acc + (item.menu.price ?? 0) * (item.quantity ?? 0);
            }, 0);
            setTotalPrice(total);
          })
          .catch((error) => {
            console.error('Error fetching cart:', error);
          });
      }
    }
  }, [hovered]);

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
        {/* Left: Navigation */}
        <div className="flex-1 flex justify-start gap-6 items-center">
          <Link to="/customer/restaurants" className={linkClass(location.pathname === "/customer/restaurants")}>
            Restoranlar
          </Link>
          <Link
            to="/customer/account-management"
            className={linkClass(location.pathname === "/customer/account-management")}
          >
            Hesabım
          </Link>
          <div onMouseEnter={() => setHovered("orders")} onMouseLeave={() => setHovered(null)} className="relative">
            <Link
              to="/customer/active-orders"
              className={linkClass(location.pathname.startsWith("/customer/active-orders"))}
            >
              Siparişlerim
            </Link>
            {hovered === "orders" && (
              <div className="absolute left-0 mt-2 w-56 bg-white border border-orange-200 shadow-lg rounded-md z-50">
                <Link to="/customer/active-orders?old=false" className={subLinkClass}>
                  Aktif Siparişler
                </Link>
                <Link to="/customer/active-orders?old=true" className={subLinkClass}>
                  Geçmiş Siparişler
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Middle: Logo - Perfectly centered */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <img src="/hurricane_image.png" alt="Logo" className="h-12 w-12" />
            <span className="text-xl font-bold text-orange-600">HURRICANE</span>
          </div>
        </div>

        {/* Right: Cart and Logout */}
        <div className="flex-1 flex justify-end items-center gap-6">
          <div onMouseEnter={() => setHovered("cart")} onMouseLeave={() => setHovered(null)} className="relative">
            <Link to="/customer/review-cart" className={linkClass()}>
              Sepetim
              <span
                className="absolute bottom-0 right-0 text-xs text-red-700 font-medium"
                style={{ marginBottom: "-10px", marginRight: "-10px" }}
              >
                {totalPrice.toFixed(2)} ₺
              </span>
            </Link>
            {hovered === "cart" && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-orange-200 shadow-lg rounded-md z-50 px-4 py-4">
                <h3 className="font-semibold">Sepetim</h3>
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.menu.pk} className="flex justify-between py-2">
                      <span className="text-sm">{item.menu.name}</span>
                      <span className="text-sm text-red-700 ">
                        {item.quantity} x {item.menu.price} = {(item.menu.price * item.quantity).toFixed(2)} ₺
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-red-700">Sepetiniz boş.</p>
                )}
              </div>
            )}
          </div>

          <button onClick={handleLogout} className={linkClass()}>
            Çıkış Yap
          </button>
        </div>
      </div>
    </nav>

  );
};

const linkClass = (active: boolean = false) =>
    `px-4 py-2 rounded-md font-semibold text-red-700 transition-colors duration-200 ${
      active ? 'bg-orange-100' : 'hover:bg-orange-100'
    }`;
const subLinkClass = `block px-6 py-3 text-sm text-red-700 hover:text-red-700 hover:bg-orange-100 transition duration-150`;

export default CustomerNavbar;
