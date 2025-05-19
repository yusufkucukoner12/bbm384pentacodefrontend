import React, { useState } from 'react';
import CustomerForm from '../../components/CustomerForm';

export interface PaymentMethod {
    id: number;
    cardName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}

export interface Customer {
    pk: number;
    address: string;
    phoneNumber: string;
    name: string;
    email: string;
    paymentMethods: PaymentMethod[];
}

const AccountManagement: React.FC = () => {
    const [customer, setCustomer] = useState<Customer>({
        pk: 0,
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        paymentMethods: [],
    });
    const [isEditing, setIsEditing] = useState(false);

    // TODO: Fetch customer data from backend API (e.g., GET /api/customer/profile)
    // Example: axios.get('/api/customer/profile', { headers: { Authorization: `Bearer ${token}` } })
    // .then(res => setCustomer(res.data.data));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditing(false);
        // TODO: Send updated customer data to backend API (e.g., PUT /api/customer/profile)
        // Example: axios.put('/api/customer/profile', customer, { headers: { Authorization: `Bearer ${token}` } })
        console.log('Updated customer:', customer);
    };

    const addPaymentMethod = () => {
        const newId = customer.paymentMethods.length
            ? Math.max(...customer.paymentMethods.map((pm) => pm.id)) + 1
            : 1;
        setCustomer((prev) => ({
            ...prev,
            paymentMethods: [
                ...prev.paymentMethods,
                {
                    id: newId,
                    cardName: '',
                    cardNumber: '',
                    expiryDate: '',
                    cvv: '',
                },
            ],
        }));
        // TODO: Send new payment method to backend API (e.g., POST /api/customer/payment-methods)
        // Example: axios.post('/api/customer/payment-methods', { cardName, cardNumber, expiryDate, cvv }, { headers: { Authorization: `Bearer ${token}` } })
    };

    const deletePaymentMethod = (id: number) => {
        setCustomer((prev) => ({
            ...prev,
            paymentMethods: prev.paymentMethods.filter((pm) => pm.id !== id),
        }));
        // TODO: Delete payment method via backend API (e.g., DELETE /api/customer/payment-methods/:id)
        // Example: axios.delete(`/api/customer/payment-methods/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Management</h2>
            <CustomerForm
                customer={customer}
                setCustomer={setCustomer}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                handleSubmit={handleSubmit}
                addPaymentMethod={addPaymentMethod}
                deletePaymentMethod={deletePaymentMethod}
            />
        </div>
    );
};

export default AccountManagement;