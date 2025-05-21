// src/pages/admin/AdminCourierManagementPage.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CourierCard from '../../components/admin/CourierCard';
import { CourierDTO } from '../../types/Courier';
import { User } from '../../types/User';

export default function AdminCourierManagementPage() {
  const [couriers, setCouriers] = useState<CourierDTO[]>([]);
  const [filteredCouriers, setFilteredCouriers] = useState<User[]>([]);
  const [newCourier, setNewCourier] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    authorities: ['ROLE_COURIER'],
    isOnline: false,
    courierPhoneNumber: '',
    isAvailable: false,      
  });
  const inputFields = [
      { name: 'username', placeholder: 'Courier Username', type: 'text' },
      { name: 'name', placeholder: 'Name Surname', type: 'text' },
      { name: 'email', placeholder: 'Email', type: 'email' },
      { name: 'password', placeholder: 'Password', type: 'password' },
      { name: 'courierPhoneNumber', placeholder: 'Courier Phone Number', type: 'text' },
      { name: 'isAvailable', placeholder: 'Is Available', type: 'checkbox' },
      { name: 'isOnline', placeholder: 'Is Online', type: 'checkbox' },]

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        const token = localStorage.getItem("token");
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
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token bulunamadı');
    await axios.put(`http://localhost:8080/api/admin/ban/${courierId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success('Courier has been suspended.');
  };

  const unsuspendCourier = async (courierId: number) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token bulunamadı');
    await axios.put(`http://localhost:8080/api/admin/unban/${courierId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success('Suspension has been removed.');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        'http://localhost:8080/api/admin/create',
        newCourier,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Restaurant created');
      const created = data.data;
      setCouriers((prev) => [...prev, created]);
      setFilteredCouriers((prev) => [...prev, created]);
      setNewCourier({ username: '',
                      name: '',
                      email: '',
                      password: '',
                      authorities: ['ROLE_COURIER'],
                      isOnline: false,
                      courierPhoneNumber: '',
                      isAvailable: false, 
                      });
    } catch {
      toast.error('Failed to create customer');
    }
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="container mx-auto p-4">
        {/* Create New Restaurant Form */}
        <form onSubmit={handleCreate} className="mb-8 bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-orange-800 mb-4">Add New Courier</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {inputFields.map(({ placeholder, name, type }) => (
              <input
                key={name}
                type={type}
                placeholder={placeholder}
                required
                className="p-2 border border-orange-300 rounded"
                value={(newCourier as any)[name]}
                onChange={(e) =>
                  setNewCourier((prev) => ({ ...prev, [name]: type === 'number' ? parseFloat(e.target.value) : e.target.value }))
                }
              />
            ))}
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Add Courier
          </button>
        </form>
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
