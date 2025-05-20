import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NavbarForAdmin } from '../../components/admin/NavbarForAdmin';
import { OrderDTO } from '../../types/Order';
import { Customer } from '../../types/Customer';
import { User } from '../../types/User';


const CustomerManagementPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();



  useEffect(() => {
    const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.get('http://localhost:8080/api/admin/customer/all', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCustomers(data.data);
      setFilteredCustomers(data.data);
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
    setFilteredCustomers(!searchQuery ? customers : customers.filter((customer) => customer.name.toLowerCase().includes(lowerQuery) || customer.email.toLowerCase().includes(lowerQuery))
    );
  }, [searchQuery, customers]);

  const handleDetails = async (id: number) => {
  try {
    const token = localStorage.getItem('adminToken');
    const { data } = await axios.get(`http://localhost:8080/api/admin/customer/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Customer details:', data.data);
    // navigate(`/admin/customer/${id}`); // uncomment if you have a detail page
  } catch {
    toast.error('Failed to fetch customer details');
  }
};

const handleEdit = (id: number) => {
  navigate(`/admin/customer/edit/${id}`);
};

const handleBan = async (userId: number) => {
  try {
    const token = localStorage.getItem('adminToken');

    await axios.put(
      `http://localhost:8080/api/admin/ban/${userId}`,  // userId ile çağırıyoruz
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success('Customer banned');
    setCustomers((prev) => prev.filter((c) => c.userId !== userId));
    setFilteredCustomers((prev) => prev.filter((c) => c.userId !== userId));
  } catch {
    toast.error('Failed to ban customer');
  }
};


  return (
    <div className="min-h-screen bg-yellow-50 p-6">
            <NavbarForAdmin />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-red-700 mb-6">Customer Management</h1>

        <input
          type="text"
          placeholder="Search by name or email..."
          className="mb-6 w-full px-4 py-2 border border-orange-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {loading ? (
          <div className="text-center text-orange-500">Loading customers...</div>
        ) : (
          <div className="grid gap-4">
            {filteredCustomers.length === 0 ? (
              <p className="text-orange-600">No customers found.</p>
            ) : (
              filteredCustomers.map((customer) => (
            <div
              key={customer.userId} 
              className="bg-white rounded-xl shadow p-4 hover:bg-orange-100 transition-all duration-200"
            >
              <div className="text-lg font-semibold text-orange-800">{customer.name}</div>
              <div className="text-sm text-orange-600">{customer.email}</div>
              <div className="text-sm text-orange-500 mb-2">{customer.address}</div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDetails(customer.userId)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Details
                </button>
                <button
                  onClick={() => handleEdit(customer.userId)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleBan(customer.userId)}  // artık pk değil userId
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Ban
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
