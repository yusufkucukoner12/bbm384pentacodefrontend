import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

// API response için tip tanımı (örnek olarak, gerekirse backend’e göre güncellenir)
interface SignupResponse {
  // Backend’in döndürdüğü bir şey yoksa boş bırakılabilir
  message?: string;
}

const Signup: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post<SignupResponse>('http://localhost:8080/api/signup', {
        username,
        email,
        password,
      });
      navigate('/login'); // Kayıt başarılıysa giriş sayfasına yönlendir
    } catch (err) {
      const axiosError = err as AxiosError;
      setError('Kayıt başarısız. Bilgileri kontrol edin.');
      console.error(axiosError); // Hata detaylarını loglama (opsiyonel)
    }
  };

  return (
    <div>
      <h2>Kayıt Ol</h2>
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
          <label>E-posta:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-postanızı girin"
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
        <button type="submit">Kayıt Ol</button>
      </form>
      <p>
        Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
      </p>
    </div>
  );
};

export default Signup;