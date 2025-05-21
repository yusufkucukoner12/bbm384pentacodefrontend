// src/pages/admin/AdminRestaurantManagementPage.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RestaurantCard from '../../components/admin/RestaurantCard';
import { Restaurant } from '../../types/Restaurant';
import { User } from '../../types/User';

export default function AdminRestaurantManagementPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    restaurantAddress: '',
    restaurantPhoneNumber: '',
    restaurantDescription: '',
    foodType: '',
    openingHours: '',
    closingHours: '',
    deliveryTime: '',
    deliveryFee: '',
    minOrderAmount: '',
    maxOrderAmount: '',
    authorities: ['ROLE_RESTAURANT'],
    customerPhoneNumber: '',
    customerAddress: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem("token");
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

  const inputFields = [
      { name: 'username', placeholder: 'Username', type: 'text' },
      { name: 'name', placeholder: 'Your Full Name', type: 'text' },
      { name: 'email', placeholder: 'Email', type: 'email' },
      { name: 'password', placeholder: 'Password', type: 'password' },
      { name: 'restaurantAddress', placeholder: 'Restaurant Address', type: 'text' },
      { name: 'restaurantPhoneNumber', placeholder: 'Restaurant Phone Number', type: 'text' },
      { name: 'restaurantDescription', placeholder: 'Restaurant Description', type: 'text' },
      { name: 'foodType', placeholder: 'Food Type', type: 'text' },
      { name: 'openingHours', placeholder: 'Opening Hours', type: 'text' },
      { name: 'closingHours', placeholder: 'Closing Hours', type: 'text' },
      { name: 'deliveryTime', placeholder: 'Delivery Time (minutes)', type: 'number' },
      { name: 'deliveryFee', placeholder: 'Delivery Fee (TL)', type: 'number' },
      { name: 'minOrderAmount', placeholder: 'Minimum Order Amount (TL)', type: 'number' },
      { name: 'maxOrderAmount', placeholder: 'Maximum Order Amount (TL)', type: 'number' }
   
  ];
  const suspendRestaurant = async (restaurantId: number) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token bulunamadı');
    await axios.put(`http://localhost:8080/api/admin/ban/${restaurantId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success('Restaurant suspended.');
  };

  const unsuspendRestaurant = async (restaurantId: number) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token bulunamadı');
    await axios.put(`http://localhost:8080/api/admin/unban/${restaurantId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success('Restaurant unsuspended.');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        'http://localhost:8080/api/admin/create',
        newRestaurant,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Restaurant created');
      const created = data.data;
      setRestaurants((prev) => [...prev, created]);
      setFilteredCustomers((prev) => [...prev, created]);
      setNewRestaurant({  name: '',
                          username: '',
                          email: '',
                          password: '',
                          restaurantAddress: '',
                          restaurantPhoneNumber: '',
                          restaurantDescription: '',
                          foodType: '',
                          openingHours: '',
                          closingHours: '',
                          deliveryTime: '',
                          deliveryFee: '',
                          minOrderAmount: '',
                          maxOrderAmount: '',
                          authorities: ['ROLE_RESTAURANT'],
                          customerPhoneNumber: '',
                          customerAddress: ''
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
          <h2 className="text-xl font-semibold text-orange-800 mb-4">Add New Restaurant</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {inputFields.map(({ placeholder, name, type }) => (
              <input
                key={name}
                type={type}
                placeholder={placeholder}
                required
                className="p-2 border border-orange-300 rounded"
                value={(newRestaurant as any)[name]}
                onChange={(e) =>
                  setNewRestaurant((prev) => ({ ...prev, [name]: type === 'number' ? parseFloat(e.target.value) : e.target.value }))
                }
              />
            ))}
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Add Restaurant
          </button>
        </form>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name or email..."
          className="mb-6 w-full px-4 py-2 border border-orange-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
