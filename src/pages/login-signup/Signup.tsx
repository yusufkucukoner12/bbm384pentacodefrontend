import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import Background from '../../Background'; // Import the same Background component

interface SignupResponse {
  message?: string;
}

const Signup: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
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
      navigate('/login'); // On successful signup, redirect to login
    } catch (err) {
      const axiosError = err as AxiosError;
      setError('Kayıt başarısız. Bilgileri kontrol edin.');
      console.error(axiosError); // Log error details (optional)
    }
  };

  return (
    <div className="login-page">
      <Background /> {/* Use the same Background component here */}
      <div style={styles.formContainer}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>Sign Up</h1>
        <p>Sign up now, to benefit from discounts</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            style={styles.input}
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
            style={styles.input}
          />
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            placeholder="Surname"
            required
            style={styles.input}
          />
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
            required
            style={styles.input}
          />
          <input
            type="email"
            value={email}
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
          <button type="submit" style={styles.button}>Sign Up</button>
        </form>
        <p style={styles.loginText}>
          If you already have an account,<Link to="/login" style={styles.loginLink}>Log In</Link>
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

export default Signup;
