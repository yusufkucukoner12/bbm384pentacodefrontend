import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CourierDTO } from '../../types/Courier';

export default function CourierAccountManagementPage() {
  const [courier, setCourier] = useState<CourierDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCourier = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/couriers/status`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCourier(response.data.data);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch courier details';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchCourier();
  }, []);

  const handleStatusToggle = async (field: 'isAvailable' | 'isOnline', value: boolean) => {
    if (!courier) return;
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/couriers/status`,
        { [field]: value },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setCourier(response.data.data);
      toast.success(`${field === 'isAvailable' ? 'Availability' : 'Online status'} updated`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update status';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Account Management</h1>
        {loading ? (
          <div className="bg-white shadow-md rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : courier ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Courier Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-gray-600">{courier.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <p className="mt-1 text-gray-600">{courier.phoneNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Availability</label>
                <div className="mt-1 flex items-center">
                  <input
                    type="checkbox"
                    checked={courier.isAvailable}
                    onChange={(e) => handleStatusToggle('isAvailable', e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    aria-label="Toggle availability"
                  />
                  <span className="ml-2 text-gray-600">
                    {courier.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Online Status</label>
                <div className="mt-1 flex items-center">
                  <input
                    type="checkbox"
                    checked={courier.isOnline}
                    onChange={(e) => handleStatusToggle('isOnline', e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    aria-label="Toggle online status"
                  />
                  <span className="ml-2 text-gray-600">{courier.isOnline ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        ) : null}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}