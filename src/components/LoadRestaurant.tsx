import { useState, useEffect } from "react";
import { Restaurant } from "../types/NewRestaurant";
import { Menu } from "../types/Menu";
import GenericCard from "./GenericCard";
import { AddToCartButton } from "./AddToCartButton";
import { FilterPanel } from "./FilterPanel";

export default function LoadRestaurant({ restaurant }: { restaurant: Restaurant }) {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<Menu[]>([]);
  const [filteredMenus, setFilteredMenus] = useState<Menu[]>([]);

  useEffect(() => {
    if (restaurant) {
      setFilteredMenus(restaurant.menus);
      setLoading(false);
    } else {
      setError("Restaurant not found.");
    }
  }, [restaurant]);

  const addToCart = (menuItem: Menu) => {
    setCart((prevCart) => [...prevCart, menuItem]);
  };

  const handleFilterChange = ({
    search,
    category,
    type,
    sort,
  }: {
    search?: string;
    category?: string;
    type?: string;
    sort?: string;
  }) => {
    let result = [...restaurant.menus];

    // 🔍 Search filter
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter((item) =>
        item.name.toLowerCase().includes(lower)
      );
    }


    // 🔃 Sort
    if (sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredMenus(result);
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6 space-y-6">
      {error && <p className="text-red-500">{error}</p>}
      {!loading ? (
        <>
          {/* ✅ Header */}
          <div className="flex gap-6 bg-white shadow rounded-xl p-4">
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="w-40 h-40 object-cover rounded-lg"
            />
            <div>
              <h2 className="text-2xl font-semibold">{restaurant.name}</h2>
              <p className="text-gray-600">{restaurant.deliveryTime} dk, Delivery Fee: {restaurant.deliveryFee}, min {restaurant.minOrderAmount} TL</p>
              <p className="text-orange-600 font-medium">⭐ 4.7 / 5 - Excellent (25 Reviews)</p>
              <p className="text-gray-500">Opening {restaurant.openingHours} - Closing {restaurant.closingHours}</p>
            </div>
          </div>

          {/* ✅ Filter Panel */}
          <FilterPanel onFilterChange={handleFilterChange} />

          {/* ✅ Menu */}
          <div>
            <h3 className="text-2xl font-semibold text-orange-700 mb-4">Menu</h3>
            <div className="grid grid-cols-1 sm:grid-cols-10 md:grid-cols-5 gap-4">
              {filteredMenus.map((item) => (
                <GenericCard
                  key={item.pk}
                  title={item.name}
                  description={item.description}
                  imageUrl={item.imageUrl}
                  footerContent={`${item.price} TL`}
                  to={`/restaurant/menu/${item.pk}`}
                >
                  <AddToCartButton menuItem={item} onClick={addToCart} />
                </GenericCard>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-400">Loading restaurant details...</p>
      )}
    </div>
  );
}
