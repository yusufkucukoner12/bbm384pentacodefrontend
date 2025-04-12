// components/admin/NavbarForAdmin.tsx
import { Link } from 'react-router-dom';

export function NavbarForAdmin() {
  return (
    <div className="flex items-center p-4 bg-amber-50 shadow">
      {/* Left Links */}
      <div className="flex items-center gap-6 flex-1">
        <Link to="/admin/main" className="text-xl font-bold text-orange-700">
          Dashboard
        </Link>
        <Link to="/admin/courier-management" className="text-xl font-bold text-orange-700">
          Courier
        </Link>
        <Link to="/admin/customer-management" className="text-xl font-bold text-orange-700">
          Customer
        </Link>
      </div>

      {/* Centered Logo and Title */}
      <div className="flex items-center gap-2">
        <img src="/hurricane_image.png" alt="Logo" className="w-12 h-12" />
        <h1 className="text-3xl font-bold text-orange-600">HURRICANE ADMIN</h1>
      </div>

      {/* Right Links and Logout */}
      <div className="flex items-center gap-6 flex-1 justify-end">
        <Link to="/admin/delivery-management" className="text-xl font-bold text-orange-700">
          Delivery
        </Link>
        <Link to="/admin/restaurant-management" className="text-xl font-bold text-orange-700">
          Restaurant
        </Link>
        <Link to="/admin/review-management" className="text-xl font-bold text-orange-700">
          Review
        </Link>
        <button className="bg-orange-700 text-white px-4 py-2 rounded">Logout</button>
      </div>
    </div>
  );
}