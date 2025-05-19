import React from 'react';
import { Customer, PaymentMethod } from '../pages/customer/AccountManagement';

interface CustomerFormProps {
    customer: Customer;
    setCustomer: React.Dispatch<React.SetStateAction<Customer>>;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    handleSubmit: (e: React.FormEvent) => void;
    addPaymentMethod: () => void;
    deletePaymentMethod: (id: number) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
    customer,
    setCustomer,
    isEditing,
    setIsEditing,
    handleSubmit,
    addPaymentMethod,
    deletePaymentMethod,
}) => {
    const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCustomer((prev) => ({ ...prev, [name]: value }));
    };

    const handlePaymentMethodChange = (
        id: number,
        field: keyof PaymentMethod,
        value: string
    ) => {
        setCustomer((prev) => ({
            ...prev,
            paymentMethods: prev.paymentMethods.map((pm) =>
                pm.id === id ? { ...pm, [field]: value } : pm
            ),
        }));
    };

    const getLastFourDigits = (cardNumber: string) => {
        return cardNumber.slice(-4);
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={customer.name}
                        onChange={handleCustomerChange}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm disabled:bg-gray-100"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={customer.email}
                        onChange={handleCustomerChange}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm disabled:bg-gray-100"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={customer.phoneNumber}
                        onChange={handleCustomerChange}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm disabled:bg-gray-100"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                        name="address"
                        value={customer.address}
                        onChange={handleCustomerChange}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm disabled:bg-gray-100"
                        rows={4}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Methods</label>
                    {customer.paymentMethods.length === 0 && !isEditing && (
                        <p className="text-sm text-gray-600">No payment methods added.</p>
                    )}
                    {customer.paymentMethods.map((pm) => (
                        <div key={pm.id} className="mb-4 p-4 border rounded-md">
                            {isEditing ? (
                                <>
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Card Name</label>
                                        <input
                                            type="text"
                                            value={pm.cardName}
                                            onChange={(e) =>
                                                handlePaymentMethodChange(pm.id, 'cardName', e.target.value)
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Card Number</label>
                                        <input
                                            type="text"
                                            value={pm.cardNumber}
                                            onChange={(e) =>
                                                handlePaymentMethodChange(pm.id, 'cardNumber', e.target.value)
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                        <input
                                            type="text"
                                            value={pm.expiryDate}
                                            onChange={(e) =>
                                                handlePaymentMethodChange(pm.id, 'expiryDate', e.target.value)
                                            }
                                            placeholder="MM/YY"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">CVV</label>
                                        <input
                                            type="text"
                                            value={pm.cvv}
                                            onChange={(e) =>
                                                handlePaymentMethodChange(pm.id, 'cvv', e.target.value)
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => deletePaymentMethod(pm.id)}
                                        className="text-sm text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <div>
                                    <p className="text-sm font-medium text-gray-700">{pm.cardName}</p>
                                    <p className="text-sm text-gray-600">**** **** **** {getLastFourDigits(pm.cardNumber)}</p>
                                </div>
                            )}
                        </div>
                    ))}
                    {isEditing && (
                        <button
                            type="button"
                            onClick={addPaymentMethod}
                            className="text-sm text-orange-600 hover:text-orange-800"
                        >
                            + Add Payment Method
                        </button>
                    )}
                </div>
                <div className="flex justify-end space-x-2">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
                            >
                                Save
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CustomerForm;