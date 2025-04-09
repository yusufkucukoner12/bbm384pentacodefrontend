import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

// API response için tip tanımı (örnek olarak)
interface LoginResponse {
  token: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<LoginResponse>('http://localhost:8080/api/login', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token); // Token saklama
      navigate('/customer/main'); // Müşteri ana sayfasına yönlendirme
    } catch (err) {
      const axiosError = err as AxiosError;
      setError('Giriş başarısız. Kullanıcı adı veya şifre yanlış.');
      console.error(axiosError); // Hata detaylarını loglama (opsiyonel)
    }
  };

  return (
    <div>
      <h2>Giriş Yap</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Kullanıcı Adı:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Kullanıcı adınızı girin"
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
        <button type="submit">Giriş Yap</button>
      </form>
      <p>
        Hesabın yok mu? <Link to="/signup">Kayıt Ol</Link>
      </p>
      <p>
        Admin misiniz? <Link to="/admin-login">Admin Giriş</Link>
      </p>
    </div>
  );
};

export default Login;