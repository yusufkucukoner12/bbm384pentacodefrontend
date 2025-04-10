import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import LoadRestaurant from '../../components/LoadRestaurant';
import { Restaurant } from '../../types/Restaurant';



export default function SingleRestaurantPage() {
  const location = useLocation();
  const { state } = location as { state: Restaurant };

  return (
    <div>
      <h2>Restaurant Details</h2>
      <LoadRestaurant restaurant={state} />
    
      <button onClick={() => window.history.back()}>Back</button>
    </div>
  );
}
