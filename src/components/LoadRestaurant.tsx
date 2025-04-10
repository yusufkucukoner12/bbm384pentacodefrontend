import { useState, useEffect } from 'react';
import { Restaurant } from '../types/restaurant'; // Adjust the import path
import GenericCard from './GenericCard'; // Adjust the import path

export default function LoadRestaurant(props: { restaurant: Restaurant }) {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (props.restaurant) {
      setLoading(false);
    } else {
      setError('Restaurant not found.');
    }
  }, [props.restaurant]);

  return (
    <div className="p-6">
      {error && <p className="text-red-500">{error}</p>}
      {!loading ? (
        <div>
          <h2 className="text-3xl font-bold mb-4">{props.restaurant.name}</h2>
          <p className="text-gray-500 mb-6">
            Version: {props.restaurant.version || 'No version info available'}
          </p>
          <h3 className="text-2xl font-semibold mb-4">Menu</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {props.restaurant.menus.map((item) => (
              <GenericCard
                key={item.pk}
                title={item.name}
                description={item.description}
                imageUrl={item.imageurl}
                footerContent={`$${item.price}`}
                to={`/restaurant/menu/${item.pk}`} 
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-400">Loading restaurant details...</p>
      )}
    </div>
  );
}
