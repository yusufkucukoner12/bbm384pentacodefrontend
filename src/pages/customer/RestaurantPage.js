import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function RestaurantPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/restaurants');
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