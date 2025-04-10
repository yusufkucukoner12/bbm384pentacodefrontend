import { useState, useEffect } from 'react';
import { Restaurant } from '../types/restaurant'; // Adjust the import path as necessary


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
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading ? (
                <div>
                    <h2>{props.restaurant.name}</h2>
                    <p>Version: {props.restaurant.version ? props.restaurant.version : 'No version info available'}</p>
                    <h3>Menu</h3>
                    <ul>
                        {props.restaurant.menus.map((item) => (
                            <li key={item.pk}>
                                <strong>{item.name}</strong>: {item.description} - ${item.price}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Loading restaurant details...</p>
            )}
        </div>
    );
}
