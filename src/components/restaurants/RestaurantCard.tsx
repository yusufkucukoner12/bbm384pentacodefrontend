import { Link } from 'react-router-dom';
import { Restaurant } from '../../types/NewRestaurant';

interface Props {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: Props) {
  return (
    <Link
      to={`/customer/restaurants/${restaurant.pk}`}
      className="group block w-full sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto bg-orange*50 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1"
    >
      <div className="overflow-hidden rounded-t-2xl h-52">
        <img
          src={restaurant.imageUrl || 'https://via.placeholder.com/150?text=No+Image'}
          alt={"No Image"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-2xl font-bold text-gray-900 truncate">{restaurant.name}</h3>
        <p className="text-gray-700 text-sm line-clamp-3">{restaurant.description}</p>

        <div className="grid grid-cols-2 gap-4 text-gray-600 text-sm">
          {restaurant.address && (
            <div className="flex items-center">
              <span className="mr-2 text-lg">📍</span>
              <span className="truncate">{restaurant.address}</span>
            </div>
          )}
          {restaurant.phoneNumber && (
            <div className="flex items-center">
              <span className="mr-2 text-lg">📞</span>
              <span>{restaurant.phoneNumber}</span>
            </div>
          )}
          {restaurant.foodType && (
            <div className="flex items-center">
              <span className="mr-2 text-lg">🍽️</span>
              <span>{restaurant.foodType}</span>
            </div>
          )}
          {restaurant.deliveryTime && (
            <div className="flex items-center">
              <span className="mr-2 text-lg">🚚</span>
              <span>{restaurant.deliveryTime}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {restaurant.deliveryFee && (
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              💸 Fee: {restaurant.deliveryFee}
            </span>
          )}
          {restaurant.minOrderAmount && (
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              💰 Min: {restaurant.minOrderAmount}
            </span>
          )}
          {restaurant.maxOrderAmount && (
            <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
              💳 Max: {restaurant.maxOrderAmount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
