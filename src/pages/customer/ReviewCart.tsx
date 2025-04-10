import { useLocation } from 'react-router-dom';
import { Menu } from '../../types/Menu';

const ReviewCart = () => {
  const location = useLocation();
  const { restaurant, cartItems } = location.state; // Access the merged data

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Review Your Cart</h2>

      <h3 className="text-2xl font-semibold mb-4">Restaurant: {restaurant.name}</h3>
      <h4 className="text-xl mb-6">Cart Items:</h4>

      <ul>
        {cartItems.map((item: Menu, index: number) => (
          <li key={index} className="mb-4">
            <div>{item.name} - ${item.price}</div>
          </li>
        ))}
      </ul>

      <button
        className="bg-green-500 text-white py-2 px-4 rounded-lg"
        onClick={() => alert('Order Finished!')}
      >
        Finish Order
      </button>
    </div>
  );
};

export default ReviewCart;
