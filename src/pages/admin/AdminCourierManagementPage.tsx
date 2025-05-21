// src/pages/admin/AdminCourierManagementPage.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CourierCard from '../../components/admin/CourierCard';
import { CourierDTO } from '../../types/Courier';
import { NavbarForAdmin } from '../../components/admin/NavbarForAdmin';

export default function AdminCourierManagementPage() {
  const [couriers, setCouriers] = useState<CourierDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) throw new Error('Kuryeler Yüklenemedi.');
        const response = await axios.get('http://localhost:8080/api/admin/courier/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCouriers(response.data.data);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Kuryeler yüklenirken bir hata oluştu.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchCouriers();
  }, []);

  const suspendCourier = async (courierId: number) => {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token bulunamadı');
    await axios.put(`http://localhost:8080/api/admin/ban/${courierId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success('Kurye askıya alındı.');
  };

  const unsuspendCourier = async (courierId: number) => {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token bulunamadı');
    await axios.put(`http://localhost:8080/api/admin/unban/${courierId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success('Askıya alma kaldırıldı.');
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <NavbarForAdmin />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Kurye Yönetimi</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {couriers.map(courier => (
              <CourierCard
                key={courier.pk}
                courier={courier}
                onSuspend={() => suspendCourier(courier.pk)}
                onUnsuspend={() => unsuspendCourier(courier.pk)}
              />
            ))}
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
}
