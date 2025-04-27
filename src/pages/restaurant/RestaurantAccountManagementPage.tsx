import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './RestaurantAccountManagementPage.css'; // Create this CSS file for styling


export default function RestaurantAccountManagementPage() {
  // State for form values
  <div className="sidebar">
        <h2>Account</h2>
        <ul>
          <li><Link to="/restaurant/menu-management">Restaurant Menu</Link></li>
          <li><Link to="/restaurant/orders">Orders</Link></li>
          <li><Link to="/restaurant/courier-management">Couriers</Link></li>
          <li><Link to="/restaurant/assigned-couriers">Assigned Couriers</Link></li>
          <li><Link to="/restaurant/idle-couriers">Idle Couriers</Link></li>
        </ul>
      </div>
  const [restaurantInfo, setRestaurantInfo] = useState({
    restaurantName: '',
    email: '',
    address: '',
    mobileNumber: '',
    taxNumber: '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, section: string) => {
    const { name, value } = e.target;

    if (section === 'restaurant') {
      setRestaurantInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (section === 'password') {
      setPasswords((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add form submission logic here (e.g., API call)
    alert('Changes have been saved!');
  };

  return (
    <div className="p-6 flex space-x-6">
      {/* Left Section - Restaurant Info */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6">Restaurant Account Management</h1>
        <form onSubmit={handleSubmit}>
          {/* Mapping over the restaurant info fields */}
          {[
            { label: 'Restaurant Name', name: 'restaurantName', placeholder: 'Enter restaurant name' },
            { label: 'Email', name: 'email', placeholder: 'Enter email', type: 'email' },
            { label: 'Address', name: 'address', placeholder: 'Enter address' },
            { label: 'Mobile Number', name: 'mobileNumber', placeholder: 'Enter mobile number' },
            { label: 'Tax Number', name: 'taxNumber', placeholder: 'Enter tax number' },
          ].map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor={field.name}>
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type="text"
                value={restaurantInfo[field.name as keyof typeof restaurantInfo]}
                onChange={(e) => handleChange(e, 'restaurant')}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                placeholder={field.placeholder}
              />
            </div>
          ))}

          <button type="submit" className="w-full py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
            Save Changes
          </button>
        </form>
      </div>

      {/* Right Section - Change Password */}
      <div className="flex-1">
        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit}>
          {/* Password change fields */}
          {[
            { label: 'Current Password', name: 'currentPassword', placeholder: 'Enter current password', type: 'password' },
            { label: 'New Password', name: 'newPassword', placeholder: 'Enter new password', type: 'password' },
            { label: 'Confirm New Password', name: 'confirmNewPassword', placeholder: 'Confirm new password', type: 'password' },
          ].map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor={field.name}>
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={passwords[field.name as keyof typeof passwords]}
                onChange={(e) => handleChange(e, 'password')}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                placeholder={field.placeholder}
              />
            </div>
          ))}

          <button type="submit" className="w-full py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
            Save Password Changes
          </button>
        </form>
      </div>
    </div>
  );
}
