import axios from 'axios';
import React from 'react'
import { useEffect , useState } from 'react'
import { API_URL } from '../../../ConfigApi/Api';
import { Link } from 'react-router-dom';
import HomeFooter from '../Home/HomeFooter';
import UserFeed from './UserFeed';
import UserProfileTop from './UserProfileTop';
import { useUser } from './UserFollowingContext';



const UserProfile = () => {
  const [user , setUser] = useState(null);
  const [loading , setLoading] = useState(true);
  const [error , setError] = useState(false);
  const { setLoggedInUser } = useUser(); 


 useEffect(()=>{
  const fetchUser = async () =>{
    try{
      const res = await axios.get(`${API_URL}/user/userProfile`, {
        withCredentials: true, // This is required for cookie-based auth
      });
      if(res.data.success){
        setUser(res.data.user);
         setLoggedInUser(res.data.user);
        setLoading(false);
      }
      else{
        setError(true);
        console.error('Failed to load user profile:', res.data.message);
      }
    }catch(err){
      console.error('Failed to load user profile:', err);
    }
  }
  fetchUser();
 }, [])
 
  if(loading){
      return <div>Loading...</div>
    }

    if(error){
        return <div>Error fetching user profile</div>
    }
    if(!user){
        return <div>No user found</div>
    }

  return (
    <div>
          
          <UserProfileTop user={user} />
          <UserFeed  user = {user}/>
          <HomeFooter/>
         
    </div>
  )
}

export default UserProfile
