// components/pages/restaurant/RestaurantMenuManagementPage.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { NavbarForRestaurant } from '../../components/restaurants/NavbarForRestaurant';
import { MenuCard } from '../../components/restaurants/MenuCard';
import { Menu } from '../../types/Menu';

export default function RestaurantMenuManagementPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const restaurantId = 1;

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/restaurant/${restaurantId}`);
        const restaurant = response.data.data;

        const menuItemsWithSearch = restaurant.menus.map((item: Menu) => ({
          ...item,
          searchString: `${item.name} ${item.price} ${item.description}`,
        }));

        setMenus(menuItemsWithSearch);
      } catch (err) {
        setError('Failed to load restaurant data.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantId]);

  const openEditModal = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteMenu = (menuId: number) => {
    setMenus((prev) => prev.filter((menu) => menu.pk !== menuId));
  };

  const handleAddMenu = () => {
    const maxId = menus.length > 0 ? Math.max(...menus.map((m) => m.pk)) : 0;
    const newMenu: Menu = {
      pk: maxId + 1,
      name: 'New Menu',
      description: 'New Description',
      price: 0,
      imageurl: '',
    };
    setMenus((prev) => [...prev, newMenu]);
  };

  return (
    <div className="min-h-screen bg-yellow-50">
      <NavbarForRestaurant />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-orange-700 mb-4">Menu Management</h1>

        <button
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          onClick={handleAddMenu}
        >
          + Add New Menu
        </button>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menus.map((menu) => (
              <MenuCard
                key={menu.pk}
                menu={menu}
                onEdit={() => openEditModal(menu)}
                onDelete={handleDeleteMenu}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
