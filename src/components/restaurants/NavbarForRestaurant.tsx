// components/Navbar.tsx
import { Link } from 'react-router-dom';

export function NavbarForRestaurant() {
  return (
    <div className="flex justify-between items-center p-4 bg-amber-50 shadow">
      <div className="flex items-center gap-6">
        <Link to="/customer/restaurants" className="text-xl font-bold text-orange-700">Restaurants</Link>
        <Link to="/customer/meals" className="text-xl font-bold text-orange-700">Meals</Link>
        <Link to="/customer/account" className="text-xl font-bold text-orange-700">Account</Link>
      </div>

      <div className="flex items-center gap-2">
        <img src="/hurricane_image.png" alt="Logo" className="w-12 h-12" />
        <h1 className="text-3xl font-bold text-orange-600">HURRICANE</h1>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/cart" className="text-xl font-semibold text-orange-700">🛒 Cart</Link>
        <button className="bg-orange-700 text-white px-4 py-2 rounded">Sign in</button>
        <button className="border border-orange-700 px-4 py-2 rounded font-semibold text-orange-700">Register</button>
      </div>
    </div>
  );
}
