//import axios from 'axios';
import React, { useState  } from 'react'
import { useEffect } from 'react';
import { API_URL } from '../../../ConfigApi/Api';
import '../../Styles/HomeData.css'
import { Link } from 'react-router-dom';
import { getFeedData} from './HomeActions/FeedActions'; 
import FeedIcons from './FeedIcons';




const HomeData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});
  

  useEffect(()=>{
          const fetchFeed = async () => {
            try {
              const resData = await getFeedData();
              setData(resData.data);

              const likedState = {};
              const userId = resData.currentUserId;

              resData.data.forEach(post => {
                likedState[post._id] = post.likes.includes(userId);
              });

              setLikedPosts(likedState);
              setLoading(false);
            } catch (err) {
              setError('Error fetching feed data' , err);
              setLoading(false);
            }
          };

    fetchFeed(); // call the helper function inside useEffect
  }, []);

    
  if (loading) {
    return <div className='text-center mt-5'>Loading...</div>;
  }
  if (error) {
    return <div className='text-center mt-5 text-danger'>{error}</div>;
  }
  if (data.length === 0) {
    return <div className='text-center mt-5'>No data available</div>;
  }
  


  return (
      <div className='feed-container'>
        {data.map((item) => (
          <div className='post' key={item._id}>
                  <div className='user-info'>
                      <Link to={`/profile/${item.userId}`} >
                        <img
                          src={item.userProfilePic.startsWith('http')
                            ? item.userProfilePic
                            : `${API_URL}/${item.userProfilePic.replace(/^\/+/, '')}`}
                          alt={`${item.fullName}'s profile`}
                          className='profile-pic'
                        />
                      </Link>

                      <Link to={`/profile/${item.userId}`}  className="text-decoration-none">
                          <span className='fullName'>{item.fullName}</span>
                      </Link>
                  </div>

                  {/* Media */}
                  {item.mediaUrl.endsWith('.mp4') ? (
                    <video controls className='media'>
                        <source
                        src={item.mediaUrl.startsWith('http')
                            ? item.mediaUrl
                            : `${API_URL}/${item.mediaUrl.replace(/^\/+/, '')}`} 
                         type='video/mp4' />
                        Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={item.mediaUrl.startsWith('http')
                          ? item.mediaUrl
                          : `${API_URL}/${item.mediaUrl.replace(/^\/+/, '')}`}
                      className='media'
                      alt='feed content'
                    />
                  )}

                  {/* Actions */}
                    <FeedIcons item={item} setLikedPosts={setLikedPosts} setData={setData} likedPosts={likedPosts}/>

                  {/* Description */}
                  <p className='description'>{item.fullName}:{item.description}</p> 
                </div>
            ))}
      </div>

    
  )
 }
  
export default HomeData
