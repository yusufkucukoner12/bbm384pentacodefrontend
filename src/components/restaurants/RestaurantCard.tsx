import { Link } from 'react-router-dom';
import { Restaurant } from '../../types/Restaurant';

interface Props {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: Props) {
  return (
    <Link to={`/customer/restaurants/${restaurant.pk}`} className="block">
      <div className="relative p-4 border border-amber-600 rounded-lg shadow-md bg-orange-50 hover:shadow-lg transition transform hover:-translate-y-1 w-full max-w-md">
        <h3 className="text-xl font-bold text-red-700">{restaurant.name}</h3>
        <div className="mt-3 w-full h-48">
          <img
            src={restaurant.imageUrl || 'https://via.placeholder.com/150?text=No+Image'}
            alt={restaurant.name}
            className="w-full h-full object-cover rounded"
            style={{ aspectRatio: '1 / 1' }}
          />
        </div>
        <div className="mt-3">
          <p className="text-amber-800 text-base">{restaurant.description}</p>
          {restaurant.address && <p className="text-amber-700 text-base mt-1">Address: {restaurant.address}</p>}
          {restaurant.phoneNumber && <p className="text-amber-700 text-base mt-1">Phone: {restaurant.phoneNumber}</p>}
          <p className="text-amber-700 text-base mt-1">Version: {restaurant.version}</p>
        </div>
      </div>
    </Link>
  );
}