import React from 'react';
import { NavbarForRestaurant } from '../../components/restaurants/NavbarForRestaurant'; // Adjust the path
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Menu } from '../../types/Menu';

const groupCartItems = (cartItems: Menu[]) => {
  const grouped: Record<number, { item: Menu; count: number }> = {};

  cartItems.forEach((item) => {
    if (grouped[item.pk]) {
      grouped[item.pk].count += 1;
    } else {
      grouped[item.pk] = { item, count: 1 };
    }
  });

  return Object.values(grouped);
};


export default function ReviewCart() {
  const location = useLocation();
  const { restaurant, cartItems } = location.state;

  const groupedItems = groupCartItems(cartItems);
  

  const handleFinishOrder = async () => {
    try {
      await axios.post('http://localhost:3000/api/order/finish-order', {
        restaurantId: restaurant.pk,
        items: groupedItems.map(({ item, count }) => ({
          menuId: item.pk,
          quantity: count,
        })),
      },{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
        },
        });

      alert('Order sent!');
      window.location.href = '/customer/restaurants';
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  const total = cartItems.reduce((acc: number, item: Menu ) => acc + item.price, 0);

  return (
    
    <div className="min-h-screen bg-yellow-50 px-8 py-6">
      <NavbarForRestaurant />
      <h1 className="text-3xl font-bold text-red-800 mb-4">My Card <span className="text-lg text-gray-500 ml-2">{cartItems.length} Item</span></h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item: Menu, index: any) => (
            <div key={index} className="flex items-start border rounded-lg p-4">
              <img src={item.imageurl} alt={item.name} className="w-28 h-24 object-cover rounded-lg mr-4" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-red-700">{item.name}</h2>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{item.price} TL</p>
                <div className="flex items-center mt-2 border rounded text-red-700 font-bold">
                  <button className="px-2 py-1">−</button>
                  <span className="px-2">{item.price}</span>
                  <button className="px-2 py-1">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center border rounded-lg p-4">
            <img src="/images/restaurant.jpg" alt="restaurant" className="w-20 h-16 rounded-lg mr-4" />
            <div>
              <h3 className="font-semibold text-md">{restaurant.name}</h3>
              <p className="text-sm text-gray-500">30-45 dk, Free Delivery, min 200 TL</p>
              <p className="text-sm text-orange-500">★ 4.7 / 5 - Excellent (25 Reviews)</p>
            </div>
            <button className="ml-auto text-red-500">{'>'}</button>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-700 mb-2">Card Summary <span className="text-sm text-gray-500 float-right">{cartItems.length} Item</span></h3>
            <div className="flex justify-between">
              <span>Total Summary</span>
              <span className="font-bold">{total} TL</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Amount to be Paid</span>
              <span className="font-bold">{total} TL</span>
            </div>
            <button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold" onClick={handleFinishOrder}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
