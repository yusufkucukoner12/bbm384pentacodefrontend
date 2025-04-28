import React, { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import Background from '../../Background';

interface LoginResponse {
  token: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  /*const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');*/
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

    // Determine user role based on route, default is customer
    const role = location.pathname.includes('restaurant')
    ? 'restaurant'
    : location.pathname.includes('courier')
    ? 'courier'
    : 'customer';

  const placeholders: Record<string, { username: string; password: string }> = {
    customer: { username: 'Username', password: 'Password' },
    restaurant: { username: 'Restaurant ID', password: 'Password' },
    courier: { username: 'Courier ID', password: 'Password' },
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<LoginResponse>('http://localhost:8080/api/login', {
        username: formData.username,
        password: formData.password,
      });
      localStorage.setItem('token', response.data.token);

      if (role === 'restaurant') {
        navigate('/restaurant/main');
      } else if (role === 'courier') {
        navigate('/courier/main');
      } else {
        navigate('/customer/main');
      }

    } catch (err) {
      const axiosError = err as AxiosError;
      setError('Login failed. Incorrect username or password.');
      console.error(axiosError);
    }
  };

   return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      <Background />
      <div className="relative z-10 bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center">
          {role.charAt(0).toUpperCase() + role.slice(1)} Log In
        </h1>
        <p className="text-center mb-6">
          {role === 'customer' ? 'HUrry up, continue to earn discounts!' : 'Access your dashboard now!'}
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
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder={placeholders[role].password}
            required
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded transition duration-200"
          >
            Log In
          </button>
        </form>
        <div className="mt-6 flex flex-col items-center gap-2">
          {role === 'customer' && (
            <>
              <p className="text-gray-500 text-sm">Are you a Restaurant or Courier?</p>
              <div className="flex gap-4">
                <Link
                  to="/restaurant/login"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition duration-200 text-sm"
                >
                  Restaurant Login
                </Link>
                <Link
                  to="/courier/login"
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition duration-200 text-sm"
                >
                  Courier Login
                </Link>
              </div>
            </>
          )}
          {role === 'restaurant' && (
            <>
              <p className="text-gray-500 text-sm">Are you a Customer or Courier?</p>
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition duration-200 text-sm"
                >
                  Customer Login
                </Link>
                <Link
                  to="/courier/login"
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition duration-200 text-sm"
                >
                  Courier Login
                </Link>
              </div>
            </>
          )}
          {role === 'courier' && (
            <>
              <p className="text-gray-500 text-sm">Are you a Customer or Restaurant?</p>
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition duration-200 text-sm"
                >
                  Customer Login
                </Link>
                <Link
                  to="/restaurant/login"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition duration-200 text-sm"
                >
                  Restaurant Login
                </Link>
              </div>
            </>
          )}
        </div>
        <p className="mt-4 text-sm text-center">
          Do not have an account?
          <Link to="/signup" className="text-red-500 hover:underline ml-1">
            Sign Up
          </Link>
        </p>
        <p className="mt-4 text-sm text-center">
          Forget your password?
          <Link to="/resetpassword" className="text-red-500 hover:underline ml-1">
            Reset Password
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;