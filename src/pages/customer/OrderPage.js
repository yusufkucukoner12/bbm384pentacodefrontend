import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function OrderPage() {
  const [order, setOrder] = useState({ item: '', quantity: 1 });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/orders', order, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/customer/main'); // Sipariş başarılıysa ana sayfaya dön
    } catch (err) {
      setError('Sipariş verilemedi.');
    }
  };

  return (
    <div>
      <h2>Sipariş Ver</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Yemek:</label>
          <input
            type="text"
            value={order.item}
            onChange={(e) => setOrder({ ...order, item: e.target.value })}
            placeholder="Yemek adını girin"
            required
          />
        </div>
        <div>
          <label>Adet:</label>
          <input
            type="number"
            value={order.quantity}
            onChange={(e) => setOrder({ ...order, quantity: e.target.value })}
            min="1"
            required
          />
        </div>
        <button type="submit">Sipariş Ver</button>
      </form>
      <Link to="/customer/restaurants">Restoranlara Geri Dön</Link>
    </div>
  );
}