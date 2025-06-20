import axios from 'axios';
import React from 'react'
import { useEffect , useState } from 'react'
import { API_URL } from '../../../ConfigApi/Api';
import '../../Styles/HomeProfile.css'
import { Link } from 'react-router-dom';
import HomeFooter from './HomeFooter';


const HomeProfile = () => {
    const [profile , setProfile] = useState([]);
    const [loading , setLoading] = useState(true);
    const [error , setError] = useState(false);

    useEffect(()=>{
        const fetchProfile = async () => {
            try{
            const res = await axios.get(`${API_URL}/user/profiles`, {
                withCredentials: true,
            })
            if(res.data.success){
                setProfile(res.data.profiles);
            }
            else{
                setError(true);
            }
        }catch(err){
            console.error('Error fetching profiles:', err);
            setError(true);
        }
        finally{
            setLoading(false);
        }
  
    }
        fetchProfile();
    }
    ,[])

    if(loading){
        return <div>Loading...</div>
    }
    if(error){
        return <div>Error fetching profiles</div>
    }
    if(profile.length === 0){
        return <div>No profiles found</div>
    }
    return(
        
       <div>
            <div className="Home-profile-container">
                {profile.map((item) => (
                    <div key={item._id} className="profile-card">
                    <Link to={`/profile/${item._id}`} state={{ user: item }}>
                    <img
                       src={item.profilePic.startsWith('http')
                           ? item.profilePic
                           : `${API_URL}/${item.profilePic.replace(/^\/+/, '')}`}
                       alt="Profile" />
                     </Link>
                    <p className="profile-name">{item.fullName}</p>
                    </div>
                ))}
            </div>

            
            
       </div>
        

    )
}

export default HomeProfile
