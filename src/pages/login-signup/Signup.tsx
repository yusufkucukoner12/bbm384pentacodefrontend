import React, { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import Background from '../../Background';

interface SignupResponse {
  message?: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    phoneNumber: '',
    email: '',
    password: '',
    againPassword: '',
  });
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  const role = location.pathname.includes('restaurant')
    ? 'restaurant'
    : location.pathname.includes('courier')
    ? 'courier'
    : 'customer';

  const placeholders: Record<string, { username: string; phoneNumber: string; email: string; password: string; againPassword: string }> = {
    customer: { username: 'Username', phoneNumber: 'Phone Number', email: 'Email', password: 'Password', againPassword: 'Enter Password Again' },
    restaurant: { username: 'Restaurant Name', phoneNumber: 'Phone Number', email: 'Email', password: 'Password', againPassword: 'Enter Password Again' },
    courier: { username: 'Name Surname', phoneNumber: 'Phone Number', email: 'Email', password: 'Password', againPassword: 'Enter Password Again' },
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.againPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await axios.post<SignupResponse>('http://localhost:8080/api/signup', {
        username: formData.username,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
      });
      navigate('/login');
    } catch (err) {
      const axiosError = err as AxiosError;
      setError('Signup failed. Please check your information.');
      console.error(axiosError);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      <Background />
      <div className="relative z-10 bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center">
          {role.charAt(0).toUpperCase() + role.slice(1)} Sign Up
        </h1>
        <p className="text-center mb-6">
          {role === 'customer' ? 'Join us and enjoy the discounts!' : 'Create your account now!'}
        </p>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder={placeholders[role].username}
            required
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <input
            type="text"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            placeholder={placeholders[role].phoneNumber}
            required
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder={placeholders[role].email}
            required
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder={placeholders[role].password}
            required
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <input
            type="password"
            value={formData.againPassword}
            onChange={(e) => setFormData({ ...formData, againPassword: e.target.value })}
            placeholder={placeholders[role].againPassword}
            required
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded transition duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Beautiful Switching Buttons */}
        <div className="mt-6 flex flex-col items-center gap-2">
          {role === 'customer' && (
            <>
              <p className="text-gray-500 text-sm">Are you a Restaurant or Courier?</p>
              <div className="flex gap-4">
                <Link
                  to="/restaurant/signup"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition duration-200 text-sm"
                >
                  Restaurant Sign Up
                </Link>
                <Link
                  to="/courier/signup"
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition duration-200 text-sm"
                >
                  Courier Sign Up
                </Link>
              </div>
            </>
          )}
          {role === 'restaurant' && (
            <>
              <p className="text-gray-500 text-sm">Are you a Customer or Courier?</p>
              <div className="flex gap-4">
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition duration-200 text-sm"
                >
                  Customer Sign Up
                </Link>
                <Link
                  to="/courier/signup"
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition duration-200 text-sm"
                >
                  Courier Sign Up
                </Link>
              </div>
            </>
          )}
          {role === 'courier' && (
            <>
              <p className="text-gray-500 text-sm">Are you a Customer or Restaurant?</p>
              <div className="flex gap-4">
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition duration-200 text-sm"
                >
                  Customer Sign Up
                </Link>
                <Link
                  to="/restaurant/signup"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition duration-200 text-sm"
                >
                  Restaurant Sign Up
                </Link>
              </div>
            </>
          )}
        </div>

        <p className="mt-4 text-sm text-center">
          Already have an account?
          <Link to="/login" className="text-red-500 hover:underline ml-1">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
