import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token); // Token saklama
      navigate('/customer/main'); // Müşteri ana sayfasına yönlendirme
    } catch (err) {
      setError('Giriş başarısız. Kullanıcı adı veya şifre yanlış.');
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
}