import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadRestaurant from "../../components/LoadRestaurant";
import { Restaurant } from "../../types/Restaurant";

export default function SingleRestaurantPage() {
  const { pk } = useParams(); // this is our restaurant ID
  const location = useLocation();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(
    (location.state as Restaurant) || null
  );

  useEffect(() => {
    if (!restaurant && pk) {
      axios
        .get(`/api/restaurants/${pk}`)
        .then((res) => setRestaurant(res.data))
        .catch((err) => console.error(err));
    }
  }, [restaurant, pk]);

  if (!restaurant) return <p>Loading...</p>;

  return <LoadRestaurant restaurant={restaurant} />;
}
