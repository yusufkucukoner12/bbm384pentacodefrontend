// src/components/admin/RestaurantCard.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Restaurant } from '../../types/Restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSuspend: () => Promise<void>;
  onUnsuspend: () => Promise<void>;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onSuspend, onUnsuspend }) => {
  const [isBanned, setIsBanned] = useState<boolean | null>(null);

  useEffect(() => {
    console.log(restaurant.pk); 
    const fetchBanStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(token);
        if (!token) throw new Error('Token bulunamadı');
        const res = await axios.get<{ data: boolean }>(
          `http://localhost:8080/api/admin/getban/${restaurant.pk}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsBanned(res.data.data);
      } catch {
        setIsBanned(false);
      }
    };
    fetchBanStatus();
  }, [restaurant.pk]);

  const handleClick = async () => {
    if (isBanned) {
      await onUnsuspend();
      setIsBanned(false);
    } else {
      await onSuspend();
      setIsBanned(true);
    }
  };

  if (isBanned === null) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <p>Durum kontrol ediliyor...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{restaurant.name}</h2>
      <p className="text-sm text-gray-600"><strong>E-posta:</strong> {restaurant.email || 'Yok'}</p>
      <p className="text-sm text-gray-600"><strong>Telefon:</strong> {restaurant.phoneNumber || 'Yok'}</p>
      <p className="text-sm text-gray-600"><strong>Adres:</strong> {restaurant.address || 'Yok'}</p>
      <p className="text-sm text-gray-600"><strong>Açıklama:</strong> {restaurant.description || 'Yok'}</p>

      <div className="mt-4">
        {isBanned ? (
          <button
            onClick={handleClick}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-sm"
          >
            Banı Kaldır
          </button>
        ) : (
          <button
            onClick={handleClick}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
          >
            Ban
          </button>
        )}
      </div>
    </div>
  );
};

export default RestaurantCard;
