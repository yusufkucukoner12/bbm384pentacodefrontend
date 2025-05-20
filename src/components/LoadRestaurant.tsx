import { useState, useEffect } from "react";
import { Restaurant} from "../types/NewRestaurant";
import { Menu } from "../types/Menu";
import { AddToCartButton } from "./AddToCartButton";
import { MenuCard } from "../components/restaurants/MenuCard";

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
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {!loading ? (
        <>
          {/* ✅ Header */}
          <div className="flex gap-6 bg-white shadow rounded-xl p-4 border border-amber-600">
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="w-40 h-40 object-cover rounded-lg"
            />
            <div>
              <h2 className="text-2xl font-semibold text-red-700">{restaurant.name}</h2>
              <p className="text-amber-800">{restaurant.foodType} • {restaurant.address}</p>
              <p className="text-amber-800">{restaurant.phoneNumber} • {restaurant.email}</p>
              <p className="text-amber-800">{restaurant.deliveryTime} dk, Delivery Fee: {restaurant.deliveryFee} TL, Min Order: {restaurant.minOrderAmount} TL</p>
              <p className="text-orange-600 font-medium">⭐ {restaurant.rating} / 5 ({restaurant.numberOfRatings} Reviews)</p>
              <p className="text-amber-800">Open {restaurant.openingHours} - {restaurant.closingHours}</p>
              {restaurant.description && <p className="text-amber-800 mt-2">{restaurant.description}</p>}
            </div>
          </div>

          {/* ✅ Menu */}
          <div>
            <h3 className="text-2xl font-semibold text-red-700 mb-4">Menu</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenus.map((item) => (
                <MenuCard
                  key={item.pk}
                  menu={item}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onSelect={() => addToCart(item)}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="text-amber-800 text-lg text-center py-12">Loading restaurant details...</p>
      )}
    </div>
  );
}