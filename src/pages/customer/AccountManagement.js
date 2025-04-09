import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AccountManagement() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/customer/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        setError('Kullanıcı bilgileri yüklenemedi.');
      }
    };
    fetchUser();
  }, []);

  return (
    <div>
      <h2>Hesap Yönetimi</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user ? (
        <div>
          <p>Kullanıcı Adı: {user.username}</p>
          <p>E-posta: {user.email}</p>
          <button>Profili Güncelle</button>
        </div>
      ) : (
        <p>Yükleniyor...</p>
      )}
    </div>
  );
}