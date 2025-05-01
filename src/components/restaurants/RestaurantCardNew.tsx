import React from 'react';
import { Link } from 'react-router-dom';
import { Restaurant } from '../../types/NewRestaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
  to?: string;
  toData?: any;
  loading?: boolean;
}

export default function RestaurantCardNew({
  restaurant,
  to,
  toData,
  loading = false,
}: RestaurantCardProps) {
  return (
    <div
      className={`bg-orange-50 border border-orange-200 rounded-2xl shadow-sm p-4 w-64 transition-transform duration-200 hover:scale-105 hover:shadow-md ${
        loading ? 'animate-pulse' : ''
      }`}
    >
      {/* Image */}
      <div className="relative h-40 w-full mb-3">
        {loading ? (
          <div className="h-full w-full bg-orange-100 rounded-xl" />
        ) : to ? (
          <Link to={to} state={toData}>
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="h-full w-full object-cover rounded-xl border border-orange-200"
            />
          </Link>
        ) : (
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="h-full w-full object-cover rounded-xl border border-orange-200"
          />
        )}
      </div>

      {/* Name */}
      <h3 className="text-lg font-bold text-orange-700">
        {loading ? <div className="h-5 bg-orange-100 rounded w-3/4" /> : restaurant.name}
      </h3>

      {/* Address */}
      {restaurant.address && (
        <p className="text-sm text-orange-500 mt-1 italic">
          {loading ? <div className="h-4 bg-orange-100 rounded w-2/3 mt-1" /> : restaurant.address}
        </p>
      )}

      {/* Description */}
      {restaurant.description && (
        <p className="text-sm text-orange-600 mt-1">
          {loading ? <div className="h-4 bg-orange-100 rounded w-5/6 mt-1" /> : restaurant.description}
        </p>
      )}

      {/* Phone */}
      {restaurant.phoneNumber && (
        <p className="text-sm text-orange-500 mt-1">
          {loading ? <div className="h-4 bg-orange-100 rounded w-1/2 mt-1" /> : `📞 ${restaurant.phoneNumber}`}
        </p>
      )}

      {/* Opening and Closing Hours */}
      {restaurant.openingHours && restaurant.closingHours && (
        <p className="text-sm text-orange-500 mt-1">
          {loading ? <div className="h-4 bg-orange-100 rounded w-2/3 mt-1" /> : `⏰ ${restaurant.openingHours} - ${restaurant.closingHours}`}
        </p>
      )}

      {/* Delivery Time */}
      {restaurant.deliveryTime && (
        <p className="text-sm text-orange-500 mt-1">
          {loading ? <div className="h-4 bg-orange-100 rounded w-2/3 mt-1" /> : `🚚 Delivery: ${restaurant.deliveryTime}`}
        </p>
      )}

      {/* Delivery Fee */}
      {restaurant.deliveryFee && (
        <p className="text-sm text-orange-500 mt-1">
          {loading ? <div className="h-4 bg-orange-100 rounded w-2/3 mt-1" /> : `💵 Fee: ${restaurant.deliveryFee}`}
        </p>
      )}

      {/* Min/Max Order Amount */}
      {(restaurant.minOrderAmount || restaurant.maxOrderAmount) && (
        <p className="text-sm text-orange-500 mt-1">
          {loading ? <div className="h-4 bg-orange-100 rounded w-2/3 mt-1" /> : `💰 Min: ${restaurant.minOrderAmount} - Max: ${restaurant.maxOrderAmount}`}
        </p>
      )}

      {/* Food Type */}
      {restaurant.foodType && (
        <p className="text-sm text-orange-500 mt-1">
          {loading ? <div className="h-4 bg-orange-100 rounded w-1/2 mt-1" /> : `🍴 Cuisine: ${restaurant.foodType}`}
        </p>
      )}

      {/* Footer */}
      <div className="text-right text-orange-500 font-semibold mt-2">
        {loading ? (
          <div className="h-4 bg-orange-100 rounded w-1/2 ml-auto" />
        ) : (
          `ID: ${restaurant.pk}`
        )}
      </div>
    </div>
  );
}
