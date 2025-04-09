import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname.split('/')[1]; // "customer", "restaurant" vs.

  return (
    <nav>
      {path === 'customer' && (
        <>
          <Link to="/customer/home">Ana Sayfa</Link> |{' '}
          <Link to="/customer/restaurants">Restoranlar</Link> |{' '}
          <Link to="/customer/menu">Menü</Link> |{' '}
          <Link to="/customer/cart">Sepet</Link> |{' '}
          <Link to="/customer/order-history">Sipariş Geçmişi</Link>
        </>
      )}
      {path === 'restaurant' && (
        <>
          <Link to="/restaurant/dashboard">Dashboard</Link> |{' '}
          <Link to="/restaurant/menu-management">Menü Yönetimi</Link> |{' '}
          <Link to="/restaurant/orders">Siparişler</Link> |{' '}
          <Link to="/restaurant/profile">Profil</Link>
        </>
      )}
      {/* Diğer bölümler için benzer */}
    </nav>
  );
}