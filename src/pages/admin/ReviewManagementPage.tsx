import React from 'react';
import { NavbarForAdmin } from '../../components/admin/NavbarForAdmin';

export default function ReviewManagementPage() {
  return (
    <div className="min-h-screen bg-amber-50">
      <NavbarForAdmin />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-orange-700 mt-8">
          Merhaba, bu bir test sayfasıdır!
        </h1>
        { /* Add your content here */}
      </div>
    </div>
  );
}
