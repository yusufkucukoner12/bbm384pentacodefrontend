// src/pages/admin/AdminRestaurantManagementPage.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RestaurantCard from '../../components/admin/RestaurantCard';
import { Restaurant } from '../../types/Restaurant';
import { NavbarForAdmin } from '../../components/admin/NavbarForAdmin';

export default function AdminRestaurantManagementPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) throw new Error('Token bulunamadı');
        const response = await axios.get('http://localhost:8080/api/admin/restaurant/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurants(response.data.data);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Restoranlar yüklenirken hata oluştu.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const suspendRestaurant = async (restaurantId: number) => {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token bulunamadı');
    await axios.put(`http://localhost:8080/api/admin/ban/${restaurantId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success('Restoran askıya alındı.');
  };

  const unsuspendRestaurant = async (restaurantId: number) => {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token bulunamadı');
    await axios.put(`http://localhost:8080/api/admin/unban/${restaurantId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success('Askıya alma kaldırıldı.');
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <NavbarForAdmin />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Restoran Yönetimi</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map(r => (
              <RestaurantCard
                key={r.pk}
                restaurant={r}
                onSuspend={() => suspendRestaurant(r.pk)}
                onUnsuspend={() => unsuspendRestaurant(r.pk)}
              />
            ))}
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
}
