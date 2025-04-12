import { Restaurant } from '../../types/Restaurant';
import GenericCard from '../../components/GenericCard'; // Adjust the path


interface RestaurantListProps {
  restaurants: Restaurant[];
  error: string;
}

export function RestaurantList({ restaurants, error }: RestaurantListProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Restoranlar</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-wrap gap-6">
        {restaurants.map((restaurant) => (
          <GenericCard
            key={restaurant.pk}
            title={restaurant.name}
            description={`Versiyon: ${restaurant.version}`}
            imageUrl="/restaurant-placeholder.jpg"
            to={`/customer/restaurants/${restaurant.pk}`}
            footerContent={`ID: ${restaurant.pk}`}
            toData={restaurant}
          />
        ))}
      </div>
    </div>
  );
}
