import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Customer } from '../../types/Customer';

interface CustomerCardProps {
  customer: Customer;
  onDetails: (pk: number) => void;
  onEdit: (customer: Customer) => void;
  onBan: (pk: number) => void;
  onUnban: (pk: number) => void;
  onDelete: (pk: number) => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onDetails, onEdit, onBan, onUnban, onDelete }) => {
  const [isBanned, setIsBanned] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchBanStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token bulunamadı');
        const res = await axios.get<{ data: boolean }>(
          `http://localhost:8080/api/admin/getban/${customer.pk}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsBanned(res.data.data);
      } catch {
        setIsBanned(false);
      }
    };
    fetchBanStatus();
  }, [customer.pk]);

  const handleBanToggle = async () => {
    try {
      if (isBanned) {
        await onUnban(customer.pk);
        setIsBanned(false);
      } else {
        await onBan(customer.pk);
        setIsBanned(true);
      }
    } catch (error) {
      console.error('Ban toggle error:', error);
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
        <h3 className="text-lg font-semibold text-orange-800">{customer.name}</h3>
        <p className="text-orange-600">{customer.email}</p>
        <p className="text-orange-600">{customer.phoneNumber}</p>
        <p className="text-orange-600">{customer.address}</p>
      </div>
      <div className="space-x-2">
        <button
          onClick={() => onDetails(customer.pk)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Details
        </button>
        <button
          onClick={() => onEdit(customer)}
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
        <button
          onClick={() => onDelete(customer.pk)}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CustomerCard;