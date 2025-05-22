import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Customer } from '../../types/Customer';
import CustomerCard from '../../components/admin/CustomerCard';

const CustomerManagementPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
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
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const inputFields = [
      { name: 'username', placeholder: 'Username', type: 'text' },
      { name: 'name', placeholder: 'Your Full Name', type: 'text' },
      { name: 'email', placeholder: 'Email', type: 'email' },
      { name: 'password', placeholder: 'Password', type: 'password' },
      { name: 'customerPhoneNumber', placeholder: 'Phone Number', type: 'text' },
      { name: 'customerAddress', placeholder: 'Address', type: 'text' }
  ];
  const editInputFields = [
    { name: 'name', placeholder: 'Your Full Name', type: 'text' },
    { name: 'email', placeholder: 'Email', type: 'email' },
    { name: 'phoneNumber', placeholder: 'Phone Number', type: 'text' },
    { name: 'address', placeholder: 'Address', type: 'text' },
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
      const { data } = await axios.get(`http://localhost:8080/api/admin/customer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      toast.error('Failed to fetch customer details');
    }
  };

const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCustomer) return;

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(`/api/admin/customer/edit/${editCustomer.pk}`, {
          name: editCustomer.name,
          email: editCustomer.email,
          phoneNumber: editCustomer.phoneNumber,
          address: editCustomer.address,
          longitude: editCustomer.longitude,
          latitude: editCustomer.latitude,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Customer updated successfully');
      const updated = data.data;
      setCustomers((prev) =>
        prev.map((c) => (c.pk === updated.pk ? updated : c))
      );
      setFilteredCustomers((prev) =>
        prev.map((c) => (c.pk === updated.pk ? updated : c))
      );
      setIsEditModalOpen(false);
      setEditCustomer(null);
    } catch {
      toast.error('Failed to update customer');
    }
  };

  const handleBan = async (pk: number) => {
    try {
      console.log('Banning customer with ID:', pk);
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8080/api/admin/ban/${pk}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Customer banned');
      setCustomers((prev) => prev.filter((c) => c.pk !== pk));
      setFilteredCustomers((prev) => prev.filter((c) => c.pk !== pk));
    } catch {
      toast.error(`Failed to ${banStatus[userId] ? 'unban' : 'ban'} customer`);
    }
  };

  const handleDelete = async (pk: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/admin/customer/${pk}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Customer deleted');
      setCustomers((prev) => prev.filter((c) => c.pk !== pk));
      setFilteredCustomers((prev) => prev.filter((c) => c.pk !== pk));
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

  const openEditModal = (customer: Customer) => {
    setEditCustomer(customer);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditCustomer(null);
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
                <CustomerCard
                  key={customer.pk}
                  customer={customer}
                  onDetails={handleDetails}
                  onEdit={openEditModal}
                  onBan={handleBan}
                  onDelete={handleDelete} onUnban={function (pk: number): void {
                    throw new Error('Function not implemented.');
                  } }                />
              ))
            )}
          </div>
        )}
        {/* Edit Customer Modal */}
        {isEditModalOpen && editCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
              <h2 className="text-xl font-semibold text-orange-800 mb-4">Edit Customer</h2>
              <form onSubmit={handleEdit}>
                <div className="grid grid-cols-1 gap-4">
                  {editInputFields.map(({ placeholder, name, type }) => (
                    <input
                      key={name}
                      type={type}
                      placeholder={placeholder}
                      required
                      className="p-2 border border-orange-300 rounded"
                      value={(editCustomer as any)[name] || ''}
                      onChange={(e) =>
                        setEditCustomer((prev) =>
                          prev
                            ? {
                                ...prev,
                                [name]: type === 'number' ? parseFloat(e.target.value) : e.target.value,
                              }
                            : prev
                        )
                      }
                    />
                  ))}
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default CustomerManagementPage;