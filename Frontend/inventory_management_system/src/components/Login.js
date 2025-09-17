import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const { token, role } = await response.json();
      login({ username, role, token });
      navigate('/'); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='container-fluid p-5 d-flex justify-content-center align-items-center' style={{ minHeight: '80vh' }}>
      <form onSubmit={handleLogin} className='card p-5 shadow-sm'>
        <h1 className='text-center mb-4'>Login</h1>
        <div className='mb-3'>
          <label className='form-label'>Username</label>
          <input
            type='text'
            className='form-control'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Password</label>
          <input
            type='password'
            className='form-control'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className='alert alert-danger'>{error}</div>}
        <button type='submit' className='btn btn-primary mt-3'>
          Login
        </button>
        <div className='text-center mt-3'>
          Don't have an account? <NavLink to='/register'>Register here</NavLink>
        </div>
      </form>
    </div>
  );
}