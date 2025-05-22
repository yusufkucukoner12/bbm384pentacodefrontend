import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Customer } from '../../types/Customer';
import { User } from '../../types/User';

const CustomerManagementPage: React.FC = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<User[]>([]);
  const [banStatus, setBanStatus] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCustomer, setNewCustomer] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    authorities: ['ROLE_CUSTOMER'],
    customerPhoneNumber: '',
    customerAddress: ''
  });

  const inputFields = [
      { name: 'username', placeholder: 'Username', type: 'text' },
      { name: 'name', placeholder: 'Your Full Name', type: 'text' },
      { name: 'email', placeholder: 'Email', type: 'email' },
      { name: 'password', placeholder: 'Password', type: 'password' },
      { name: 'customerPhoneNumber', placeholder: 'Phone Number', type: 'text' },
      { name: 'customerAddress', placeholder: 'Address', type: 'text' }
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:8080/api/admin/customer/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(data.data);
        setFilteredCustomers(data.data);

        // Fetch ban status for each customer
        const banStatusPromises = data.data.map(async (customer: User) => {
          try {
            const res = await axios.get<{ data: boolean }>(
              `http://localhost:8080/api/admin/getban/${customer.pk}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return { id: customer.pk, isBanned: res.data.data };
          } catch {
            return { id: customer.pk, isBanned: false };
          }
        });

        const banStatuses = await Promise.all(banStatusPromises);
        const banStatusMap = banStatuses.reduce((acc, { id, isBanned }) => {
          acc[id] = isBanned;
          return acc;
        }, {} as { [key: number]: boolean });
        setBanStatus(banStatusMap);

      } catch {
        toast.error('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    setFilteredCustomers(
      !searchQuery
        ? customers
        : customers.filter(
            (customer) =>
              customer.name.toLowerCase().includes(lowerQuery) ||
              customer.email.toLowerCase().includes(lowerQuery)
          )
    );
  }, [searchQuery, customers]);

  const handleDetails = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`http://localhost:8080/api/admin/customer/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      toast.error('Failed to fetch customer details');
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/customer/edit/${id}`);
  };

  const handleBanToggle = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token bulunamadı');

      if (banStatus[userId]) {
        // Unban the customer
        await axios.put(
          `http://localhost:8080/api/admin/unban/${userId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Customer unbanned');
        setBanStatus((prev) => ({ ...prev, [userId]: false }));
      } else {
        // Ban the customer
        await axios.put(
          `http://localhost:8080/api/admin/ban/${userId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Customer banned');
        setBanStatus((prev) => ({ ...prev, [userId]: true }));
        // setCustomers((prev) => prev.filter((c) => c.pk !== userId));
        // setFilteredCustomers((prev) => prev.filter((c) => c.pk !== userId));
      }
    } catch {
      toast.error(`Failed to ${banStatus[userId] ? 'unban' : 'ban'} customer`);
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/admin/customer/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Customer deleted');
      setCustomers((prev) => prev.filter((c) => c.pk !== userId));
      setFilteredCustomers((prev) => prev.filter((c) => c.pk !== userId));
      setBanStatus((prev) => {
        const newBanStatus = { ...prev };
        delete newBanStatus[userId];
        return newBanStatus;
      });
    } catch {
      toast.error('Failed to delete customer');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        'http://localhost:8080/api/admin/create',
        newCustomer,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Customer created');
      const created = data.data;
      setCustomers((prev) => [...prev, created]);
      setFilteredCustomers((prev) => [...prev, created]);
      setBanStatus((prev) => ({ ...prev, [created.pk]: false }));
      setNewCustomer({name: '', username: '',  email: '', password: '', authorities: ['ROLE_CUSTOMER'], customerPhoneNumber: '', customerAddress: ''});
    } catch {
      toast.error('Failed to create customer');
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-red-700 mb-6">Customer Management</h1>

        {/* Create New Customer Form */}
        <form onSubmit={handleCreate} className="mb-8 bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-orange-800 mb-4">Add New Customer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {inputFields.map(({ placeholder, name, type }) => (
              <input
                key={name}
                type={type}
                placeholder={placeholder}
                required
                className="p-2 border border-orange-300 rounded"
                value={(newCustomer as any)[name]}
                onChange={(e) =>
                  setNewCustomer((prev) => ({ ...prev, [name]: type === 'number' ? parseFloat(e.target.value) : e.target.value }))
                }
              />
            ))}
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Add Customer
          </button>
        </form>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name or email..."
          className="mb-6 w-full px-4 py-2 border border-orange-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Customer Cards */}
        {loading ? (
          <div className="text-center text-orange-500">Loading customers...</div>
        ) : (
          <div className="grid gap-4">
            {filteredCustomers.length === 0 ? (
              <p className="text-orange-600">No customers found.</p>
            ) : (
              filteredCustomers.map((customer) => (
                <div
                  key={customer.pk}
                  className="bg-white rounded-xl shadow p-4 hover:bg-orange-100 transition-all duration-200"
                >
                  <div className="text-lg font-semibold text-orange-800">{customer.name}</div>
                  <div className="text-sm text-orange-600">{customer.email}</div>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleDetails(customer.pk)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleEdit(customer.pk)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleBanToggle(customer.pk)}
                      className={`px-3 py-1 ${banStatus[customer.pk] ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600'} text-white rounded text-sm`}
                    >
                      {banStatus[customer.pk] ? 'Unban' : 'Ban'}
                    </button>
                    <button
                      onClick={() => handleDelete(customer.pk)}
                      className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default CustomerManagementPage;