import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../../Styles/Signup.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../ConfigApi/Api';


const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic , setProfilePic] = useState('');  
  const navigate = useNavigate();
  
 const submitHandler = async (e) => {
    e.preventDefault();
     const formData = new FormData();
  formData.append("fullName", fullName);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("profilePic", profilePic);

    const res = await axios.post(`${API_URL}/user/signup`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });    console.log(res.data);
    setFullName('');
    setEmail('');
    setPassword('');
    setProfilePic('');
    alert("Registration successful");
    navigate("/signin")
 }

  return (
    <div className='signup-container'>
  <div className='signup-card'>
    <h1 className='signup-title'>Register with a New Account!</h1>
    <form className='signup-form' onSubmit={(e) => submitHandler(e)} method="POST">
      <div className='form-group'>
        <label className='form-label'>Full Name</label>
        <input 
          className='form-input'
          onChange={(e) => setFullName(e.target.value)}
          value={fullName}
          type="text" 
          name="fullName" 
          placeholder="Enter your full name" 
          required
        />
      </div>
      
      <div className='form-group'>
        <label className='form-label'>Email</label>
        <input 
          className='form-input'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email" 
          name="email" 
          placeholder="Enter your email" 
          required
        />
      </div>
      
      <div className='form-group'>
        <label className='form-label'>Password</label>
        <input 
          className='form-input'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password" 
          name="password"
          placeholder="Create a password"  
          required
        />
      </div>
      
      <div className='form-group'>
        <label className='form-label'>Profile Pic</label>
        <input 
          className='form-input'
          onChange={(e) => setProfilePic(e.target.files[0])}  //  Get the actual File object
          type="file" 
          name="profilePic"  // This name must match multer field
          accept="image/*"
          required
        />

      </div>
      
      
      <button className='submit-btn' type="submit">Create Account</button>
      
      <div className='login-link'>
        Already have an account? <Link to="/signin">Login here</Link>
      </div>
    </form>
  </div>
</div>
  )
}

export default Signup
