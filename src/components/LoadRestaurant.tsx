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
    <div className="p-6 space-y-6">
      {error && <p className="text-red-500">{error}</p>}
      {!loading ? (
        <>
          {/* ✅ Restaurant Header */}
          <div className="flex gap-6 bg-white shadow rounded-xl p-4">
            <img
              src={props.restaurant.name}
              alt={props.restaurant.name}
              className="w-40 h-40 object-cover rounded-lg"
            />
            <div>
              <h2 className="text-2xl font-semibold">{props.restaurant.name}</h2>
              <p className="text-gray-600">
                30-45 dk, Free Delivery, min 200 TL
              </p>
              <p className="text-orange-600 font-medium">
                ⭐ 4.7 / 5 - Excellent (25 Reviews)
              </p>
              <p className="text-gray-500">
                Opening 10:00 - Closing 22:00
              </p>
            </div>
          </div>

          {/* ✅ Tabs */}
          <div className="flex gap-4 border-b text-center">
            {["Menu", "Reviews", "Payment Methods", "Restaurant Info"].map((tab) => (
              <button
                key={tab}
                className="pb-2 px-4 font-semibold text-orange-700 border-b-2 border-orange-700"
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ✅ Menu Title */}
          <div>
            <h3 className="text-2xl font-semibold text-orange-700 mb-4">Menu</h3>

            {/* ✅ Menu Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {props.restaurant.menus.map((item) => (
                <GenericCard
                  key={item.pk}
                  title={item.name}
                  description={item.description}
                  imageUrl={item.imageurl}
                  footerContent={`${item.price} TL`}
                  to={`/restaurant/menu/${item.pk}`}
                >
                  <AddToCartButton menuItem={item} onClick={addToCart} />
                </GenericCard>
              ))}
            </div>
          </div>

          {/* ✅ Cart Display */}
          <Cart cartItems={cart} />

          {/* ✅ Review Cart Button */}
          <Link
            to="/customer/review-cart"
            state={mergedData}
            className="inline-block mt-6 text-blue-600 underline hover:text-blue-800"
          >
            Review Cart
          </Link>
        </>
      ) : (
        <p className="text-gray-400">Loading restaurant details...</p>
      )}
    </div>
  );
}
