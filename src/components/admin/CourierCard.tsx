// src/components/admin/CourierCard.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CourierDTO } from '../../types/Courier';

interface CourierCardProps {
  courier: CourierDTO;
  onSuspend: () => Promise<void>;
  onUnsuspend: () => Promise<void>;
}

const CourierCard: React.FC<CourierCardProps> = ({ courier, onSuspend, onUnsuspend }) => {
  const [isBanned, setIsBanned] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchBanStatus = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('Token bulunamadı');
        const response = await axios.get<{ data: boolean }>(
          `http://localhost:8080/api/admin/getban/${courier.pk}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsBanned(response.data.data);
      } catch {
        setIsBanned(false);
      }
    };
    fetchBanStatus();
  }, [courier.pk]);

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
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Kurye Adı</label>
        <p className="text-sm text-gray-600">{courier.name}</p>
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Telefon Numarası</label>
        <p className="text-sm text-gray-600">{courier.phoneNumber || 'Yok'}</p>
      </div>

      <div className="mt-4">
        {isBanned ? (
          <button
            type="button"
            onClick={handleClick}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-sm"
          >
            Banı Kaldır
          </button>
        ) : (
          <button
            type="button"
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

export default CourierCard;
