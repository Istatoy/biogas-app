import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      // Предположим, что сервер возвращает { token: '...' }
      const { token } = response.data;
      localStorage.setItem('token', token);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <div>
        <label>Email</label><br />
        <input
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
        /><br />
      </div>
      <div>
        <label>Password</label><br />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br />
      </div>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
}

export default Login;
