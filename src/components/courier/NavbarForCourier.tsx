// components/courier/NavbarForCourier.tsx
import { Link } from 'react-router-dom';

export function NavbarForCourier() {
  return (
    <div className="flex items-center p-4 bg-amber-50 shadow">
      {/* Left Links */}
      <div className="flex items-center gap-6 flex-1">
        <Link to="/courier/restaurants" className="text-xl font-bold text-orange-700">
          Restoranlar
        </Link>
        <Link to="/courier/review-cart" className="text-xl font-bold text-orange-700">
          Sepetim
        </Link>
        <Link to="/courier/order" className="text-xl font-bold text-orange-700">
          Sipariş Ver
        </Link>
        <Link to="/courier/account-management" className="text-xl font-bold text-orange-700">
          Hesabım
        </Link>
      </div>

      {/* Centered Logo and Title */}
      <div className="flex items-center gap-2">
        <img src="/hurricane_image.png" alt="Logo" className="w-12 h-12" />
        <h1 className="text-3xl font-bold text-orange-600">HURRICANE COURIER</h1>
      </div>

      {/* Right Links and Logout */}
      <div className="flex items-center gap-6 flex-1 justify-end">
        <button className="bg-orange-700 text-white px-4 py-2 rounded">Logout</button>
      </div>
    </div>
  );
}
