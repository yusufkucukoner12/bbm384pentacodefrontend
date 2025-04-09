import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Restoran veri tipi tanımı
interface Restaurant {
  id: number;
  name: string;
}

export default function RestaurantPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get<Restaurant[]>('http://localhost:8080/api/restaurants');
        setRestaurants(response.data);
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
          <li key={restaurant.id}>
            <Link to="/customer/order">{restaurant.name}</Link>
          </li>
        ))}
      </ul>
      <Link to="/customer/main">Geri Dön</Link>
    </div>
  );
}
