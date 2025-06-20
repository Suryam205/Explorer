import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'; 
import axios from 'axios';
import { API_URL } from '../../../ConfigApi/Api';
import { useEffect, useState } from 'react';
import '../../Styles/TopSection.css'

const UserProfileTop = ({user}) => {
    const navigate = useNavigate();
    //const [following , setFollowing] = useState([]);
   const [postsLength, setPostLength] = useState([]);
  
   
       useEffect(() => {
           const fetchPosts = async () => {
               try {
                   const res = await axios.get(`${API_URL}/posts/${user._id}`, {
                       withCredentials: true,
                   });
                   if (res.data.success) {
                       setPostLength(res.data.userPosts.length);
   
                   } else {
                      console.log("error")
                   }
               } catch (err) {
                   console.error('Error fetching user posts length:', err);
                  
               } 
           };
           fetchPosts();
       }, []);
   

    const handleLogout = async()=>{
        const res = await axios.post(`${API_URL}/user/logout`, {}, {
            withCredentials: true      // This is required for cookie-based auth
        });
        if(res.data.success){
            console.log('Logout successful');
        }
        else{
            console.error('Logout failed:', res.data.message);
        }
        navigate('/signin');
    }
 
 
  return (
    <div className='profile-wrapper'>

       <div className="section1">
            <span className='appName'>Explorer</span>
            <button className='logout-btn' onClick={handleLogout}>
                <FiLogOut className="logout-icon" />
                 <span>Logout</span>
            </button>
         </div>


       <div className="profile-container">
            <div className="left-profile-section">
              <img src={user.profilePic.startsWith('http') ? user.profilePic : `${API_URL}/${user.profilePic.replace(/^\/+/, '')}`}
               alt="Profile" className="profile-image" />
            </div>

            <div className="right-profile-section">
              <div className="username-row">
                <h2 className="username">{user.fullName}</h2>
              </div>

              <div className="stats-row">
                <div className="stat">
                  <strong>{postsLength}</strong>
                  <span>posts</span>
                </div>
                <div className="stat">
                  <Link to="/userFollowers" state={user._id} className="text-decoration-none text-dark"  ><strong>{user.followers}</strong></Link>
                  <span>followers</span>
                </div>
                <div className="stat">
                  <Link to="/userFollowing" state={{ userId: user._id, followingList: user.followingList }} className="text-decoration-none text-dark"  ><strong>{user.followingList.length}</strong></Link>
                  <span>following</span>
                </div>
              </div>
               <div className="bio-section">
                  <p>{user.bio}</p>
               </div>
            </div>
          </div>

    </div>
  )
}

export default UserProfileTop
