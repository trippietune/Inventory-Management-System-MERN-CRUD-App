import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Warehouse Staff');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      alert('Registration successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='container-fluid p-5 d-flex justify-content-center align-items-center' style={{ minHeight: '80vh' }}>
      <form onSubmit={handleRegister} className='card p-5 shadow-sm'>
        <h1 className='text-center mb-4'>Register</h1>
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
        <div className='mb-3'>
          <label className='form-label'>Role</label>
          <select className='form-select' value={role} onChange={(e) => setRole(e.target.value)}>
            <option value='Warehouse Staff'>Warehouse Staff</option>
            <option value='System Administrator'>System Administrator</option>
            <option value='Order Manager'>Order Manager</option>
          </select>
        </div>
        {error && <div className='alert alert-danger'>{error}</div>}
        <button type='submit' className='btn btn-primary mt-3'>
          Register
        </button>
        <div className='text-center mt-3'>
          Already have an account? <NavLink to='/login'>Login here</NavLink>
        </div>
      </form>
    </div>
  );
}