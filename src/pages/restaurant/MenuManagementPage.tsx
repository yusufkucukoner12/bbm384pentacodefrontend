import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NavbarForRestaurant } from '../../components/restaurants/NavbarForRestaurant';
import { MenuCard } from '../../components/restaurants/MenuCard';
import { MenuTable } from '../../components/restaurants/MenuTable';
import { MenuFormModal } from '../../components/restaurants/MenuFormModal';
import { SkeletonLoader } from '../../components/restaurants/SkeletonLoader';
import { Menu } from '../../types/Menu';
import { fetchMenus, createMenu, updateMenu, deleteMenu } from '../../components/MenuService';

export default function MenuManagementPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [filteredMenus, setFilteredMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortOption, setSortOption] = useState('name-asc');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedMenus, setSelectedMenus] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadMenus = async () => {
      try {
        const fetchedMenus = await fetchMenus();
        setMenus(fetchedMenus);
        setFilteredMenus(fetchedMenus);
      } catch (err) {
        setError('Failed to load menus.');
        toast.error('Failed to load menus.');
      } finally {
        setLoading(false);
      }
    };
    loadMenus();
  }, []);

  useEffect(() => {
    let result = [...menus];

    // Search
    if (searchQuery) {
      result = result.filter((menu) =>
        `${menu.name} ${menu.description} ${menu.category}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Filter
    if (filterCategory) {
      result = result.filter((menu) => menu.category.toLowerCase() === filterCategory.toLowerCase());
    }
    if (filterType) {
      result = result.filter((menu) => (filterType === 'drink' ? menu.isDrink : !menu.isDrink));
    }

    // Sort
    result.sort((a, b) => {
      if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
      if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      return 0;
    });

    setFilteredMenus(result);
    setCurrentPage(1);
  }, [searchQuery, sortOption, filterCategory, filterType, menus]);

  const handleAddMenu = () => {
    setSelectedMenu(null);
    setIsModalOpen(true);
  };

  const handleEditMenu = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsModalOpen(true);
  };

  const handleDeleteMenu = async (menuId: number) => {
    if (!window.confirm('Are you sure you want to delete this menu?')) return;
    try {
      await deleteMenu(menuId);
      setMenus((prev) => prev.filter((menu) => menu.pk !== menuId));
      setSelectedMenus((prev) => prev.filter((id) => id !== menuId));
      toast.success('Menu deleted successfully.');
    } catch (err) {
      toast.error('Failed to delete menu.');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm('Are you sure you want to delete the selected menus?')) return;
    try {
      await Promise.all(selectedMenus.map((id) => deleteMenu(id)));
      setMenus((prev) => prev.filter((menu) => !selectedMenus.includes(menu.pk)));
      setSelectedMenus([]);
      toast.success('Selected menus deleted successfully.');
    } catch (err) {
      toast.error('Failed to delete selected menus.');
    }
  };

  const handleFormSubmit = async (formData: Omit<Menu, 'pk'>) => {
    try {
      if (selectedMenu) {
        const updatedMenu = await updateMenu(selectedMenu.pk, formData);
        setMenus((prev) =>
          prev.map((menu) => (menu.pk === updatedMenu.pk ? updatedMenu : menu))
        );
        toast.success('Menu updated successfully.');
      } else {
        const newMenu = await createMenu(formData);
        setMenus((prev) => [...prev, newMenu]);
        toast.success('Menu created successfully.');
      }
    } catch (err) {
      toast.error(selectedMenu ? 'Failed to update menu.' : 'Failed to create menu.');
    }
  };

  const handleSelectMenu = (menuId: number) => {
    setSelectedMenus((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    );
  };

  const paginatedMenus = filteredMenus.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = Array.from(new Set(menus.map((menu) => menu.category).filter(Boolean)));

  return (
    <div className="min-h-screen bg-orange-50">
      <NavbarForRestaurant />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-red-700 mb-6">Menu Management</h1>

        {/* Sticky Header */}
        <div className="sticky top-0 bg-orange-50 z-10 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
            <div className="flex items-center w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search menus..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-amber-600 rounded px-3 py-2 pl-10 focus:ring-2 focus:ring-orange-700"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-amber-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-amber-800"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            <div className="flex space-x-4">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-amber-600 rounded px-3 py-2 focus:ring-2 focus:ring-orange-700"
              >
                <option value="name-asc">Sort: Name (A-Z)</option>
                <option value="name-desc">Sort: Name (Z-A)</option>
                <option value="price-asc">Sort: Price (Low-High)</option>
                <option value="price-desc">Sort: Price (High-Low)</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-amber-600 rounded px-3 py-2 focus:ring-2 focus:ring-orange-700"
              >
                <option value="">Filter: All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-amber-600 rounded px-3 py-2 focus:ring-2 focus:ring-orange-700"
              >
                <option value="">Filter: All Types</option>
                <option value="food">Food</option>
                <option value="drink">Drink</option>
              </select>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                className="px-3 py-2 bg-amber-800 text-white rounded hover:bg-amber-900"
              >
                {viewMode === 'grid' ? 'Table View' : 'Grid View'}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button
              onClick={handleAddMenu}
              className="px-4 py-2 bg-orange-700 text-white rounded hover:bg-orange-800 transition"
            >
              + Add New Menu
            </button>
            {selectedMenus.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Selected ({selectedMenus.length})
              </button>
            )}
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <SkeletonLoader />
        ) : filteredMenus.length === 0 ? (
          <div className="text-center py-12">
            <img
              src="https://via.placeholder.com/200?text=No+Menus"
              alt="No menus"
              className="mx-auto mb-4"
            />
            <p className="text-amber-800 text-lg">No menus found. Add a new menu to get started.</p>
            <button
              onClick={handleAddMenu}
              className="mt-4 px-4 py-2 bg-orange-700 text-white rounded hover:bg-orange-800"
            >
              Add Menu
            </button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedMenus.map((menu) => (
                  <MenuCard
                    key={menu.pk}
                    menu={menu}
                    onEdit={() => handleEditMenu(menu)}
                    onDelete={handleDeleteMenu}
                    isSelected={selectedMenus.includes(menu.pk)}
                    onSelect={handleSelectMenu}
                  />
                ))}
              </div>
            ) : (
              <MenuTable
                menus={paginatedMenus}
                onEdit={handleEditMenu}
                onDelete={handleDeleteMenu}
                selectedMenus={selectedMenus}
                onSelect={handleSelectMenu}
              />
            )}
            <div className="flex justify-between items-center mt-6">
              <p className="text-amber-800">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredMenus.length)} of {filteredMenus.length}{' '}
                menus
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-amber-800 text-white rounded disabled:bg-gray-300"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, Math.ceil(filteredMenus.length / itemsPerPage))
                    )
                  }
                  disabled={currentPage === Math.ceil(filteredMenus.length / itemsPerPage)}
                  className="px-3 py-1 bg-amber-800 text-white rounded disabled:bg-gray-300"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        <MenuFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          initialMenu={selectedMenu}
        />

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}