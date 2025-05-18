// components/pages/admin/AdminRestaurantManagementPage.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { RestaurantCard } from '../../components/admin/RestaurantCard';
import { Restaurant } from '../../types/Restaurant';
import { NavbarForAdmin } from '../../components/admin/NavbarForAdmin';

export default function AdminRestaurantManagementPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [newRestaurantName, setNewRestaurantName] = useState('');
  const [newRestaurantAddress, setNewRestaurantAddress] = useState('');
  const [newRestaurantPhone, setNewRestaurantPhone] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/restaurant/all',
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        ); // API endpoint'i restoran verisini alacak şekilde değiştirin
        setRestaurants(response.data.data); // API'nin döndürdüğü veriyi uygun şekilde ayarlayın
      } catch (err) {
        setError('Failed to load restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleEdit = (restaurantId: number) => {
    console.log(`Edit restaurant with ID: ${restaurantId}`);
    // Burada düzenleme işlemini başlatabilirsiniz
  };

  const handleDelete = (restaurantId: number) => {
    console.log(`Delete restaurant with ID: ${restaurantId}`);
    // Burada restoran silme işlemini başlatabilirsiniz
  };

  const handleAddRestaurant = async () => {
    try {
      const newRestaurant = {
        name: newRestaurantName,
        address: newRestaurantAddress,
        phone: newRestaurantPhone
      };
      const response = await axios.post('http://localhost:8080/api/restaurant', newRestaurant, 
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      
      if (response.status === 200) {
        // Yeni restoran başarılı bir şekilde eklendiyse
        setRestaurants([...restaurants, response.data]); // Restoran listesine ekleyin
        setNewRestaurantName('');
        setNewRestaurantAddress('');
        setNewRestaurantPhone('');
      }
    } catch (err) {
      setError('Failed to add restaurant');
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50">
        <NavbarForAdmin />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-orange-700 mb-4">Restaurant Management</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Add New Restaurant</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Restaurant Name"
              value={newRestaurantName}
              onChange={(e) => setNewRestaurantName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Restaurant Address"
              value={newRestaurantAddress}
              onChange={(e) => setNewRestaurantAddress(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Restaurant Phone"
              value={newRestaurantPhone}
              onChange={(e) => setNewRestaurantPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <button
            onClick={handleAddRestaurant}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Add Restaurant
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.pk}  // pk yerine doğru alanı kullanın
                restaurant={restaurant}
                onEdit={() => handleEdit(restaurant.pk)}  // id yerine pk kullanın
                onDelete={() => handleDelete(restaurant.pk)}  // Aynı şekilde
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
