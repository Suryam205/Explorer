import React, { useState , useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../Styles/Signin.css';
import { API_URL } from '../../../ConfigApi/Api';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/ping`);
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      email,
      password, 
    };

    try {
      const res = await axios.post(`${API_URL}/user/signin`, data, {
        withCredentials: true,
      });

      if (res.data.success) {
        navigate('/home');
      } else {
        alert('Login failed');
      }

    } catch (error) {
        if (error.response?.data?.message) {
            alert(error.response.data.message);
        } 
        else {
            alert('Something went wrong. Please try again.');
        }
       console.error('Login error:', error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='signin-container'>
      <div className='signin-card'>
        <h1 className='signin-title'>Sign In</h1>
        <form className='signin-form' onSubmit={submitHandler}>
          <div className='form-group'>
            <label className='form-label'>Email</label>
            <input
              className='form-input'
              type='email'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email'
              required
            />
          </div>

          <div className='form-group'>
            <label className='form-label'>Password</label>
            <input
              className='form-input'
              type='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter your password'
              required
            />
          </div>

          

          <button className='submit-btn' type='submit' disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className='signup-link'>
            Don't have an account? <Link to='/signup'>Create one</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
