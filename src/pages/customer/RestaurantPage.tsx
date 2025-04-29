import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Restaurant } from '../../types/Restaurant';
import { ApiResponse } from '../../types/ApiResponse';
import GenericCard from '../../components/GenericCard'; // Adjust the path
import { AddToCartButton } from '../../components/AddToCartButton';
import { NavbarForRestaurant } from '../../components/restaurants/NavbarForRestaurant'; // Adjust the path
import { SearchAndSort } from '../../components/restaurants/SearchAndSort'; // Adjust the path
import { FilterPanel } from '../../components/restaurants/FilterPanel'; // Adjust the import path
import { RestaurantList } from '../../components/restaurants/RestaurantList'; // Adjust the import path

export default function RestaurantPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true); // Initialize as true

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token); 

        const response = await axios.get<ApiResponse<Restaurant[]>>(
          'http://localhost:8080/api/restaurant/all',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRestaurants(response.data.data);
      } catch (err) {
        setError('Restoranlar yüklenemedi.');
      } finally {
        setLoading(false); // Set loading to false when fetch completes
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="min-h-screen bg-yellow-50">
      <NavbarForRestaurant />

      <div className="flex">
        <div className="w-4/5 p-4">
          <SearchAndSort />
          <RestaurantList restaurants={restaurants} error={error} loading={loading} />
        </div>

        <div className="w-1/5 p-4">
          <FilterPanel />
        </div>
      </div>
    </div>
  );
}