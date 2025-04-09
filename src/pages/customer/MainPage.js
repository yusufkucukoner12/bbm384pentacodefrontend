import { Link } from 'react-router-dom';

export default function MainPage() {
  return (
    <div>
      <h2>Hoş Geldiniz!</h2>
      <p>Yemek siparişi vermek için seçeneklerinizi keşfedin.</p>
      <div>
        <Link to="/customer/restaurants">
          <button>Restoranlara Göz At</button>
        </Link>
        <Link to="/customer/order">
          <button>Sipariş Ver</button>
        </Link>
        <Link to="/customer/account-management">
          <button>Hesabım</button>
        </Link>
      </div>
    </div>
  );
}