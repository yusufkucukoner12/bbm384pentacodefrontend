import { Restaurant } from '../../types/Restaurant';
import GenericCard from '../../components/GenericCard'; // Adjust the path

interface RestaurantListProps {
  restaurants: Restaurant[];
  error: string;
  loading?: boolean;
}

export function RestaurantList({ restaurants, error, loading = false }: RestaurantListProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Restoranlar</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-wrap gap-6">
        {loading
          ? // Render skeleton cards while loading
            Array(9)
              .fill(0)
              .map((_, index) => (
                <GenericCard
                  key={`loading-${index}`}
                  title=""
                  description=""
                  imageUrl=""
                  footerContent=""
                  loading={true}
                />
              ))
          : restaurants.length === 0 ? (
            <p className="text-gray-500">No restaurants found.</p>
          ) : (
            restaurants.map((restaurant) => (
              <GenericCard
                key={restaurant.pk}
                title={restaurant.name}
                description={`Versiyonrevenue: ${restaurant.version}`}
                imageUrl={restaurant.imageUrl}
                to={`/customer/restaurants/${restaurant.pk}`}
                footerContent={`ID: ${restaurant.pk}`}
                toData={restaurant}
                loading={false}
              />
            ))
          )}
      </div>
    </div>
  );
}