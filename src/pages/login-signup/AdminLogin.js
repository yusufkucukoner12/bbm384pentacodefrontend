import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/admin/login', {
        username,
        password,
      });
      localStorage.setItem('adminToken', response.data.token); // Admin token saklama
      navigate('/admin/main'); // Admin ana sayfasına yönlendirme
    } catch (err) {
      setError('Admin girişi başarısız. Bilgileri kontrol edin.');
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
}