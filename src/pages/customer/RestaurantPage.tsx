import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Restaurant } from '../../types/Restaurant';
import { ApiResponse } from '../../types/ApiResponse';
import GenericCard from '../../components/GenericCard'; // Adjust the path
import { AddToCartButton } from '../../components/AddToCartButton';
import { NavbarForRestaurant } from '../../components/restaurants/NavbarForRestaurant'; // Adjust the path
import { SearchAndSort } from '../../components/restaurants/SearchAndSort'; // Adjust the path
import { FilterPanel } from '../../components/restaurants/FilterPanel'; // Adjust the import path for Menu type
import { RestaurantList } from '../../components/restaurants/RestaurantList'; // Adjust the import path for Menu type


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
    <div className="min-h-screen bg-yellow-50">
      <NavbarForRestaurant />
  
      {/* Alt kısım: yatay ikiye bölünmüş */}
      <div className="flex">
        {/* %80 kısım: SearchAndSort + RestaurantList */}
        <div className="w-4/5 p-4">
          <SearchAndSort />
          <RestaurantList restaurants={restaurants} error={error} />
        </div>
  
        {/* %20 kısım: FilterPanel */}
        <div className="w-1/5 p-4">
          <FilterPanel />
        </div>
      </div>
    </div>
  );
  
}