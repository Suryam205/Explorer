import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { API_URL } from '../../../ConfigApi/Api';
import { Link, useLocation } from 'react-router-dom';
import HomeFooter from '../Home/HomeFooter';




const LikedProfiles = () => {
   const [likedProfiles, setLikedProfiles] =useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const location = useLocation();
    const {postId }  = location.state;
    console.log('Post ID:', postId);

    useEffect(()=>{ 
        const fetchLikedProfiles = async () => {
            try {
                const res = await axios.get(`${API_URL}/posts/likedProfiles/${postId}`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    setLikedProfiles(res.data.likedProfiles);
                    console.log('Liked Profiles:', res.data.likedProfiles);
                } else {
                    setError(true);
                    
                }
            } catch (err) {
                setError(true);
                console.error('Error fetching liked profiles:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLikedProfiles();
    }, []);
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching liked profiles.</div>;
    }

  return (
   <div>
        <h1 className="followers-title">Liked Profiles ({likedProfiles.length})</h1>
        <div className="followers-list">
            {likedProfiles.map((profile) => (
            <div key={profile._id} className="follower-card">
                <Link to={`/profile/${profile._id}`} state={{ user: profile }}>
                <img
                    className="left"
                    src={
                            profile.profilePic.startsWith('http')
                            ? profile.profilePic
                            : `${API_URL}/${profile.profilePic.replace(/^\/+/, '')}`
                        }

                    alt={profile.username}
                />
                <p className="right">{profile.fullName}</p>
                </Link>
            </div>
            ))}
        </div>
        <HomeFooter/>
</div>
  )
}

export default LikedProfiles
