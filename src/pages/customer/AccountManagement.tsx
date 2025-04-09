import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

// Kullanıcı profili için tip tanımı
interface UserProfile {
  username: string;
  email: string;
  // Backend’in döndürdüğü ek alanlar varsa buraya eklenebilir
}

const AccountManagement: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token bulunamadı.');
        }
        const response = await axios.get<UserProfile>('http://localhost:8080/api/customer/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        const axiosError = err as AxiosError | Error;
        setError('Kullanıcı bilgileri yüklenemedi.');
        console.error(axiosError); // Hata detaylarını loglama (opsiyonel)
      }
    };
    fetchUser();
  }, []); // Boş dependency array, sadece mount olduğunda çalışır

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
};

export default AccountManagement;