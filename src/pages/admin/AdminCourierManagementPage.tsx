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
  const [filteredCouriers, setFilteredCouriers] = useState<CourierDTO[]>([]);
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
    const [editCourier, setEditCourier] = useState<CourierDTO | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const inputFields = [
      { name: 'username', placeholder: 'Courier Username', type: 'text' },
      { name: 'name', placeholder: 'Name Surname', type: 'text' },
      { name: 'email', placeholder: 'Email', type: 'email' },
      { name: 'password', placeholder: 'Password', type: 'password' },
      { name: 'phoneNumber', placeholder: 'Courier Phone Number', type: 'text' },
      { name: 'profilePictureUrl', placeholder: 'Profile Picture URL', type: 'text' },]

  const editInputFields = [
    { name: 'name', placeholder: 'Courier Name', type: 'text' },
    { name: 'phoneNumber', placeholder: 'Phone Number', type: 'text' },
  ];//more can be added

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

      toast.success('Courier created');
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
      toast.error('Failed to create courier');
    }
  };

   const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCourier) return;

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(`/api/admin/courier/edit/${editCourier.pk}`, {
          name: editCourier.name,
          phoneNumber: editCourier.phoneNumber,
},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Courier updated successfully');
      const updated = data.data;
      setCouriers((prev) =>
        prev.map((c) => (c.pk === updated.pk ? updated : c))
      );
      setFilteredCouriers((prev) =>
        prev.map((c) => (c.pk === updated.pk ? updated : c))
      );
      setIsEditModalOpen(false);
      setEditCourier(null);
    } catch {
      toast.error('Failed to update courier');
    }
  };

  const openEditModal = (courier: CourierDTO) => {
    setEditCourier(courier);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditCourier(null);
  };
  
      const handleStatusUpdate = (updatedCourier: CourierDTO) => {
    setCouriers((prev) =>
      prev.map((c) => (c.pk === updatedCourier.pk ? updatedCourier : c))
    );
    setFilteredCouriers((prev) =>
      prev.map((c) => (c.pk === updatedCourier.pk ? updatedCourier : c))
    );
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="container mx-auto p-4">
        {/* Create New Courier Form */}
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
                onUnsuspend={() => unsuspendCourier(courier.pk)} onDetails={function (pk: number): void {
                  throw new Error('Function not implemented.');
                } } onEdit={openEditModal}
                 onStatusUpdate={handleStatusUpdate}              />
            ))}
          </div>
        )}
      </div>
      {/* Edit Courier Modal */}
        {isEditModalOpen && editCourier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
              <h2 className="text-xl font-semibold text-orange-800 mb-4">Edit Courier</h2>
              <form onSubmit={handleEdit}>
                <div className="grid grid-cols-1 gap-4">
                  {editInputFields.map(({ placeholder, name, type }) => (
                    <input
                      key={name}
                      type={type}
                      placeholder={placeholder}
                      required
                      className="p-2 border border-orange-300 rounded"
                      value={(editCourier as any)[name] || ''}
                      onChange={(e) =>
                        setEditCourier((prev) =>
                          prev
                            ? {
                                ...prev,
                                [name]: type === 'number' ? parseFloat(e.target.value) : e.target.value,
                              }
                            : prev
                        )
                      }
                    />
                  ))}
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
}
