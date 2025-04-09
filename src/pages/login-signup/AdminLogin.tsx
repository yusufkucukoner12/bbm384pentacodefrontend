import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

// API response için tip tanımı
interface AdminLoginResponse {
  token: string; // Admin token’ı bekliyoruz
}

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<AdminLoginResponse>('http://localhost:8080/api/admin/login', {
        username,
        password,
      });
      localStorage.setItem('adminToken', response.data.token); // Admin token saklama
      navigate('/admin/main'); // Admin ana sayfasına yönlendirme
    } catch (err) {
      const axiosError = err as AxiosError;
      setError('Admin girişi başarısız. Bilgileri kontrol edin.');
      console.error(axiosError); // Hata detaylarını loglama (opsiyonel)
    }
  };

  return (
    <div>
      <h2>Admin Giriş</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Admin Kullanıcı Adı:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Admin kullanıcı adınızı girin"
            required
          />
        </div>
        <div>
          <label>Şifre:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifrenizi girin"
            required
          />
        </div>
        <button type="submit">Admin Giriş</button>
      </form>
      <p>
        Normal kullanıcı mısınız? <Link to="/login">Kullanıcı Girişi</Link>
      </p>
    </div>
  );
};

export default AdminLogin;