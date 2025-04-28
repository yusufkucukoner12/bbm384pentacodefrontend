import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from './public/hurricane.jpg'; // Import your logo
import Sidebar from '../../components/Sidebar';



interface NavItem {
  to: string;
  text: string;
  subpages?: NavItem[];
}
interface SideBar{

}

const routes: Record<string, NavItem[]> = {
  restaurant: [
    {
      to: '/restaurant/account-management',
      text: 'Hesap Yönetimi',
      subpages: [
        { to: '/restaurant/account-management/info', text: 'Bilgi' },
        { to: '/restaurant/account-management/security', text: 'Güvenlik' },
      ],
    },
    { to: '/restaurant/menu-management', text: 'Menü Yönetimi' },
    { to: '/restaurant/orders', text: 'Siparişler' },
    { to: '/restaurant/courier-management', text: 'Kurye Yönetimi' },
  ]
};

export default function RestaurantAccountManagementPage() {
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
    <div className="flex">
      {/* Sidebar */}
      <Sidebar routes={routes.restaurant} />

      {/* Main Content */}
      <div className="w-4/5 p-6 flex justify-start">
        {/* Left Section - Restaurant Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-6">Restaurant Account Management</h1>
          <form onSubmit={handleSubmit}>
            {[{ label: 'Restaurant Name', name: 'restaurantName', placeholder: 'Enter restaurant name' },
              { label: 'Email', name: 'email', placeholder: 'Enter email', type: 'email' },
              { label: 'Address', name: 'address', placeholder: 'Enter address' },
              { label: 'Mobile Number', name: 'mobileNumber', placeholder: 'Enter mobile number' },
              { label: 'Tax Number', name: 'taxNumber', placeholder: 'Enter tax number' }].map((field) => (
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
            <button type="submit" className="w-1/2 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
              Save Changes
            </button>
          </form>
        </div>

        {/* Right Section - Change Password */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handleSubmit}>
            {[{ label: 'Current Password', name: 'currentPassword', placeholder: 'Enter current password', type: 'password' },
              { label: 'New Password', name: 'newPassword', placeholder: 'Enter new password', type: 'password' },
              { label: 'Confirm New Password', name: 'confirmNewPassword', placeholder: 'Confirm new password', type: 'password' }].map((field) => (
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
                  className="w-4/5 px-4 py-2 border border-gray-300 rounded"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
            <button type="submit" className="w-1/2 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
              Save Password Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
