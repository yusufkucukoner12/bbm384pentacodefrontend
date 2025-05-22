import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CourierDTO } from '../../types/Courier';
import { toast } from 'react-toastify';

interface CourierCardProps {
  courier: CourierDTO;
  onDetails: (pk: number) => void;
  onEdit: (courier: CourierDTO) => void;
  onSuspend: () => Promise<void>;
  onUnsuspend: () => Promise<void>;
  onStatusUpdate: (updatedCourier: CourierDTO) => void; // New callback to update parent
}

const CourierCard: React.FC<CourierCardProps> = ({
  courier,
  onDetails,
  onEdit,
  onSuspend,
  onUnsuspend,
  onStatusUpdate,
}) => {
  const [isBanned, setIsBanned] = useState<boolean | null>(null);
  const [isOnline, setIsOnline] = useState(courier.isOnline);
  const [isAvailable, setIsAvailable] = useState(courier.isAvailable);

  useEffect(() => {
    const fetchBanStatus = async () => {
      try {
        const token = localStorage.getItem('token');
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

  const handleBanToggle = async () => {
    try {
      if (isBanned) {
        await onUnsuspend();
        setIsBanned(false);
      } else {
        await onSuspend();
        setIsBanned(true);
      }
    } catch (error) {
      console.error('Ban toggle error:', error);
      toast.error('Failed to toggle ban status');
    }
  };

  const handleStatusToggle = async (field: 'isOnline' | 'isAvailable', value: boolean) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token bulunamadı');
      const payload = {
        [field]: value,
      };
      const response = await axios.put(
        `http://localhost:8080/api/admin/courier/edit/${courier.pk}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedCourier = response.data.data;
      if (field === 'isOnline') {
        setIsOnline(value);
      } else {
        setIsAvailable(value);
      }
      onStatusUpdate(updatedCourier); // Notify parent of update
      toast.success(`${field === 'isOnline' ? 'Online' : 'Availability'} status updated`);
    } catch (error: any) {
      console.error(`${field} toggle error:`, error);
      toast.error(`Failed to update ${field === 'isOnline' ? 'online' : 'availability'} status`);
    }
  };

  if (isBanned === null) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
        <p className="text-orange-600">Durum kontrol ediliyor...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold text-orange-800">{courier.name}</h3>
        <p className="text-orange-600"><strong>Phone Number:</strong> {courier.phoneNumber || 'Yok'}</p>
        <label className="flex items-center text-orange-600">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => handleStatusToggle('isAvailable', e.target.checked)}
            className="mr-2"
          />
          <strong>Available</strong>
        </label>
        <label className="flex items-center text-orange-600">
          <input
            type="checkbox"
            checked={isOnline}
            onChange={(e) => handleStatusToggle('isOnline', e.target.checked)}
            className="mr-2"
          />
          <strong>Online</strong>
        </label>
      </div>
      <div className="space-x-2">
        <button
          onClick={() => onDetails(courier.pk)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Details
        </button>
        <button
          onClick={() => onEdit(courier)}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={handleBanToggle}
          className={`px-3 py-1 text-white rounded ${
            isBanned ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {isBanned ? 'Unban' : 'Ban'}
        </button>
      </div>
    </div>
  );
};

export default CourierCard;