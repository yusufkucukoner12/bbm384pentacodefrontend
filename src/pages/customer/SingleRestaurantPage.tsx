import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadRestaurant from "../../components/LoadRestaurant";
import { Restaurant } from "../../types/NewRestaurant";
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
        .get(`/api/restaurant/${pk}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => setRestaurant(res.data.data))
        .catch((err) => console.error(err));
    }
  }, [restaurant, pk]);

  console.log("Restaurant:", restaurant);

  if (!restaurant) return <p>Loading...</p>;

  return (
      <div className="min-h-screen bg-orange-50">
  
        <div className="flex">
          <div className="w-5/5 p-4">
          <LoadRestaurant restaurant={restaurant} />;
          </div>

        </div>
      </div>
    );
}
