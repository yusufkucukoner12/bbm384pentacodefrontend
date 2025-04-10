import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Restaurant } from '../../types/Restaurant';
import { ApiResponse } from '../../types/ApiResponse';
import GenericCard from '../../components/GenericCard'; // Adjust the path

export default function RestaurantPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get<ApiResponse<Restaurant[]>>('http://localhost:8080/api/restaurant/all');
        setRestaurants(response.data.data);
      } catch (err) {
        setError('Restoranlar yüklenemedi.');
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Restoranlar</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-wrap gap-6">
        {restaurants.map((restaurant) => (
          <GenericCard
            key={restaurant.pk}
            title={restaurant.name}
            description={`Versiyon: ${restaurant.version}`}
            imageUrl="/restaurant-placeholder.jpg"
            to={`/customer/restaurants/${restaurant.pk}`}
            footerContent={`ID: ${restaurant.pk}`}
            toData={restaurant}
          />
        ))}
      </div>

      <Link
        to="/customer/main"
        className="inline-block mt-6 text-blue-600 underline hover:text-blue-800"
      >
        Geri Dön
      </Link>
    </div>
  );
}
