// components/pages/admin/AdminCourierManagementPage.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CourierCard } from '../../components/admin/CourierCard';
import { CourierDTO } from '../../types/Courier';

export default function AdminCourierManagementPage() {
  const [couriers, setCouriers] = useState<CourierDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourier, setSelectedCourier] = useState<CourierDTO | null>(null);

  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await axios.get('http://localhost:8080/api/admin/courier/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });        
      const courierData = response.data.data;
        setCouriers(courierData);
      } catch (err) {
        setError('Kuryeler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchCouriers();
  }, []);

  const handleAddCourier = () => {
    const maxId = couriers.length > 0 ? Math.max(...couriers.map(c => c.pk)) : 0;
    const newCourier: CourierDTO = {
      pk: maxId + 1,
      name: 'Yeni Kurye',
      phoneNumber: '',
      isAvailable: false,
      isOnline: false,
    };
    setCouriers(prev => [...prev, newCourier]);
  };

  const handleEditCourier = (courier: CourierDTO) => {
    setSelectedCourier(courier);
    // burada modal açma vs. işlemleri yapılabilir
  };

  const handleDeleteCourier = (courierId: number) => {
    setCouriers(prev => prev.filter(courier => courier.pk !== courierId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Kurye Yönetimi</h1>

        <button
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          onClick={handleAddCourier}
        >
          + Yeni Kurye Ekle
        </button>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {couriers.map(courier => (
              <CourierCard
                key={courier.pk}
                courier={courier}
                onEdit={() => handleEditCourier(courier)}
                onDelete={() => handleDeleteCourier(courier.pk)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
