import React from 'react'
import { useEffect , useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../../ConfigApi/Api'

const ProtectedRoute = ({children}) => {
    const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/protected`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setAuthorized(true);
        } else {
          navigate('/signin');
        }
      } catch (err) {
        navigate('/signin');
        console.error('Authorization error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  return authorized ? children : null;
};




export default ProtectedRoute
