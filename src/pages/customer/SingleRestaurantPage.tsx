import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadRestaurant from "../../components/LoadRestaurant";
import { Restaurant } from "../../types/Restaurant";
import { NavbarForRestaurant } from '../../components/restaurants/NavbarForRestaurant'; // Adjust the path
import { FilterPanel } from '../../components/restaurants/FilterPanel'; // Adjust the import path



export default function SingleRestaurantPage() {
  const { pk } = useParams(); // this is our restaurant ID
  const location = useLocation();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(
    (location.state as Restaurant) || null
  );

  useEffect(() => {
    if (!restaurant && pk) {
      axios
        .get(`/api/restaurant/${pk}`)
        .then((res) => setRestaurant(res.data))
        .catch((err) => console.error(err));
    }
  }, [restaurant, pk]);

  console.log("Restaurant:", restaurant);

  if (!restaurant) return <p>Loading...</p>;

  return (
      <div className="min-h-screen bg-yellow-50">
        <NavbarForRestaurant />
  
        <div className="flex">
          <div className="w-4/5 p-4">
          <LoadRestaurant restaurant={restaurant} />;
          </div>
  
          <div className="w-1/5 p-4">
            <FilterPanel />
          </div>
        </div>
      </div>
    );
}
