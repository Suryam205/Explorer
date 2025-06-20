import axios from 'axios';
import React from 'react'
import { useEffect , useState } from 'react'
import { API_URL } from '../../../ConfigApi/Api';
import '../../Styles/UserFollowers.css'
import { Link, useLocation } from 'react-router-dom';
import HomeFooter from '../Home/HomeFooter';


const UserFollowers = () => {
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const location = useLocation()
    const userId = location.state;

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const res = await axios.get(`${API_URL}/user/followers/${userId}`, {
                    withCredentials: true,
                });
                if (res.data.success) {                 
                        setFollowers(res.data.followers);
                        
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error('Error fetching followers:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchFollowers();
    }
    , []);
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error fetching followers</div>;
    }
    if (followers.length === 0) {
        return <div>No followers found</div>;
    }
    
  return (
        <div >
            <h1 className="followers-title">Followers({followers.length})</h1>
            <div className="followers-list">
                {followers.map((follower) => (
                    <div key={follower._id} className="follower-card">
                     
                        <Link to={`/profile/${follower._id}`} state={{ user: follower }}>
                            <img className="left" 
                                src={follower.profilePic.startsWith('http')
                                          ? follower.profilePic
                                           : `${API_URL}/${follower.profilePic.replace(/^\/+/, '')}`}
                                 alt="Follower" />
                             <p className="right"> {follower.fullName}</p>
                        </Link>
                       
                    </div>
                ))}
            </div>
            <HomeFooter/>
        </div>
    );
}

export default UserFollowers

//src={`${API_URL}/${follower.profilePic.replace(/^\/+/, '')}`}
