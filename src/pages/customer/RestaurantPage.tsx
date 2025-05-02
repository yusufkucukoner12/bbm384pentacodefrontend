import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RestaurantTable } from '../../components/restaurants/RestaurantTable';
import { SkeletonLoader } from '../../components/restaurants/SkeletonLoader';
import { Restaurant } from '../../types/NewRestaurant';
import { fetchRestaurants } from '../../components/service/RestaurantService';
import GenericCard from '../../components/GenericCard';
import RestaurantCardNew from '../../components/restaurants/RestaurantCardNew';

export default function RestaurantPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortOption, setSortOption] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        const fetchedRestaurants = await fetchRestaurants(searchQuery, sortOption);
        setRestaurants(fetchedRestaurants);
        setCurrentPage(1);
      } catch (err) {
        setError('Failed to load restaurants.');
        toast.error('Failed to load restaurants.');
      } finally {
        setLoading(false);
      }
    };
    loadRestaurants();
  }, [searchQuery, sortOption]);

  const paginatedRestaurants = restaurants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-red-700 mb-6">Restaurants</h1>

        {/* Sticky Header */}
        <div className="sticky top-0 bg-orange-50 z-9 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
            <div className="flex items-center w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search restaurants..."
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
              </select>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                className="px-3 py-2 bg-amber-800 text-white rounded hover:bg-amber-900"
              >
                {viewMode === 'grid' ? 'Table View' : 'Grid View'}
              </button>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <SkeletonLoader />
        ) : restaurants.length === 0 ? (
          <div className="text-center py-12">
            <img
              src="https://via.placeholder.com/200?text=No+Restaurants"
              alt="No restaurants"
              className="mx-auto mb-4"
            />
            <p className="text-amber-800 text-lg">No restaurants found. Try adjusting your search.</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedRestaurants.map((restaurant) => (
                  <RestaurantCardNew key={restaurant.pk} restaurant={restaurant} />
                ))}
              </div>
            ) : (
              <RestaurantTable restaurants={paginatedRestaurants} />
            )}
            <div className="flex justify-between items-center mt-6">
              <p className="text-amber-800">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, restaurants.length)} of {restaurants.length}{' '}
                restaurants
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
                      Math.min(prev + 1, Math.ceil(restaurants.length / itemsPerPage))
                    )
                  }
                  disabled={currentPage === Math.ceil(restaurants.length / itemsPerPage)}
                  className="px-3 py-1 bg-amber-800 text-white rounded disabled:bg-gray-300"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
