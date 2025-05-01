import { useState, useEffect } from 'react';
import { Restaurant } from '../types/Restaurant';
import GenericCard from './GenericCard';
import { Menu } from '../types/Menu';
import { AddToCartButton } from './AddToCartButton';
import { Cart } from './Cart';
import { Link } from 'react-router-dom';

export default function LoadRestaurant(props: { restaurant: Restaurant }) {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<Menu[]>([]);

  useEffect(() => {
    if (props.restaurant) {
      setLoading(false);
    } else {
      setError('Restaurant not found.');
    }
  }, [props.restaurant]);

  const addToCart = (menuItem: Menu) => {
    setCart((prevCart) => [...prevCart, menuItem]);
  };

  const mergedData = {
    restaurant: props.restaurant,
    cartItems: cart,
  };

  return (
   <div className="p-6 space-y-8 max-w-7xl mx-auto">
  {error && <p className="text-red-600 text-lg font-medium">{error}</p>}

  {!loading ? (
    <>
      {/* Restaurant Header */}
      <div className="flex flex-col md:flex-row gap-6 bg-orange shadow-md rounded-2xl p-6">
        <img
          src={props.restaurant.name}
          alt={props.restaurant.name}
          className="w-full md:w-40 h-40 object-cover rounded-xl shadow"
        />
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-800">{props.restaurant.name}</h2>
          <p className="text-gray-600 text-sm">30-45 dk, Free Delivery, min 200 TL</p>
          <p className="text-yellow-600 font-medium text-sm">⭐ 4.7 / 5 - Excellent (25 Reviews)</p>
          <p className="text-gray-500 text-sm">Opening 10:00 - Closing 22:00</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 text-sm font-semibold text-gray-700">
        {["Menu", "Reviews", "Payment Methods", "Restaurant Info"].map((tab) => (
          <button
            key={tab}
            className="pb-2 px-4 hover:text-orange-600 transition-colors border-b-2 border-transparent hover:border-orange-600"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Menu Section */}
      <div>
        <h3 className="text-2xl font-bold text-orange-700 mb-4">Menu</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {props.restaurant.menus.map((item) => (
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
    <p className="text-gray-400 text-center text-lg">Loading restaurant details...</p>
  )}
</div>

  );
}
