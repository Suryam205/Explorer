import axios from 'axios';
import React from 'react'
import { useEffect , useState } from 'react'
import { API_URL } from '../../../ConfigApi/Api';
import '../../Styles/UserFollowers.css'
import { Link, useLocation } from 'react-router-dom';


const FollowingList = () => {
  
    const [followingList, setFollowingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);


    const location = useLocation();
    const {userId }  = location.state;
    
   
     useEffect(() => {
        const fetchFollowingList = async () => {
            try {
                const res = await axios.get(`${API_URL}/user/following/${userId}`, {
                    withCredentials: true,
                });
                if (res.data.success) {                 
                        setFollowingList(res.data.following);
                        //console.log(res.data.following)
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

        fetchFollowingList();
    }
    , []);
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error fetching followers</div>;
    }
    if (followingList.length === 0) {
        return <div>No followers found</div>;
    }

     


  return (
     <div>
                <h1 className="followers-title">Followers({followingList.length})</h1>
                <div className="followers-list">
                    {followingList.map((following) => (
                         
                        <div key={following._id} className="follower-card">
                            <Link to={`/profile/${following._id}`} state={{ user: following }}>
                               
                                <img className="left" src={`${API_URL}/${following.profilePic.replace(/^\/+/, '')}`} alt="Follower" />
                                 <p className="right"> {following.fullName}</p>
                            </Link>
                           
                        </div>
                    ))}
                </div>
            </div>
  )
}

export default FollowingList
