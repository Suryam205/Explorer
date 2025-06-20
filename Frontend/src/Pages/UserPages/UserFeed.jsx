import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../ConfigApi/Api';
import '../../Styles/UserFeed.css'
import { Link } from 'react-router-dom';


const UserFeed = ({user}) => {
   
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`${API_URL}/posts/${user._id}`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    setPosts(res.data.userPosts);

                } else {
                    setError(true);
                }
            } catch (err) {
                console.error('Error fetching user posts:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div className='No-Posts-message'>Error While Fetching</div>;
    }
    if (posts.length === 0) {
        return <div className='No-Posts-message'>Posts will appear here once shared!!</div>;
    }
    return (
        <div>
            <h1 className='userPosts-header'>{user.fullName}'s Posts</h1>

            <div className="user-posts-list">
                {posts.map((post) => (
                    <div key={post._id} className="user-post-card">
                        <Link to="/contentDetails" state={{ post: post, userId: user._id }}>
                            {post.mediaUrl.endsWith('.mp4') ? (
                                    <video controls className='user-media-reel'>
                                    <source
                                     src={post.mediaUrl.startsWith('http')
                                        ? post.mediaUrl
                                        : `${API_URL}/${post.mediaUrl.replace(/^\/+/, '')}`}
                                    type='video/mp4' />
                                    Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <img
                                    src={post.mediaUrl.startsWith('http')
                                        ? post.mediaUrl
                                        : `${API_URL}/${post.mediaUrl.replace(/^\/+/, '')}`}
                                    className='user-media-image'
                                    alt='feed content'
                                    />
                                )} 
                            </Link>          
                      </div>
                ))}
            </div>
        </div>
    );

  
}

export default UserFeed
