import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import Background from '../../Background'; // << we are using this!!

interface LoginResponse {
  token: string;
}

const Login: React.FC = () => {
  const [mail, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<LoginResponse>('http://localhost:8080/api/login', {
        mail,
        password,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/customer/main');
    } catch (err) {
      const axiosError = err as AxiosError;
      setError('Login failed. Incorrect email or password.');
      console.error(axiosError);
    }
  };

  return (
    <div className="login-page">
      <Background /> {/* <<< adds your food images background */}
      <div style={styles.formContainer}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>Log In</h1>
        <p>HUrry up, continue to earn discount!</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            value={mail}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            required
            style={styles.input}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Log In</button>
        </form>
        <p style={styles.loginText}>
          If you do not have an account, <Link to="/signup" style={styles.loginLink}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  formContainer: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    textAlign: 'center' as const,
    maxWidth: '400px',
    width: '100%',
    zIndex: 2, // Important to keep form above the images
    position: 'relative' as const,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
    marginTop: '20px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#E74C3C',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  loginText: {
    marginTop: '15px',
    fontSize: '14px',
  },
  loginLink: {
    color: '#E74C3C',
    textDecoration: 'none',
    marginLeft: '5px',
  },
};

export default Login;
