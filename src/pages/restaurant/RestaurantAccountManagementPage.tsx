import React, { useState } from 'react';
import RestaurantForm from '../../components/restaurants/RestaurantForm';
import { Restaurant } from '../../types/Restaurant'; // Placeholder import, adjust as needed

const RestaurantAccountManagement: React.FC = () => {
    const [restaurant, setRestaurant] = useState<Restaurant>({
        pk: 0,
        name: '',
        version: null,
        menus: [],
        imageUrl: '',
        address: '',
        phoneNumber: '',
        description: '',
        email: '',
    });
    const [isEditing, setIsEditing] = useState(false);

    // TODO: Fetch restaurant data from backend API (e.g., GET /api/restaurant/profile)
    // Example: axios.get('/api/restaurant/profile', { headers: { Authorization: `Bearer ${token}` } })
    // .then(res => setRestaurant(res.data.data));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditing(false);
        // TODO: Send updated restaurant data to backend API (e.g., PUT /api/restaurant/profile)
        // Example: axios.put('/api/restaurant/profile', restaurant, { headers: { Authorization: `Bearer ${token}` } })
        console.log('Updated restaurant:', restaurant);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Restaurant Account Management</h2>
            <RestaurantForm
                restaurant={restaurant}
                setRestaurant={setRestaurant}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};

export default RestaurantAccountManagement;