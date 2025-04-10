import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Restaurant } from '../../types/restaurant'; // Adjust the import path as necessary
import { ApiResponse } from '../../types/apiresponse'; // Adjust the import path as necessary

export default function RestaurantPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get<ApiResponse<Restaurant[]>>('http://localhost:8080/api/restaurant/all');
        console.log('Restoranlar:', response.data.data);
        console.log(response.data.data); 
        setRestaurants(response.data.data);
      } catch (err) {
        setError('Restoranlar yüklenemedi.');
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div>
      <h2>Restoranlar</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.pk}>
          <Link to={`/customer/restaurants/${restaurant.pk}`} state={restaurant}>Go to {restaurant.name}</Link>
          <h3>{restaurant.name}</h3>
          <p>Version: {restaurant.version}</p>
          </li>
        ))}
      </ul>
      <Link to="/customer/main">Geri Dön</Link>
    </div>
  );
}
