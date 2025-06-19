import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../ConfigApi/Api';
import '../../../Styles/ExplorePage.css'
import HomeFooter from '../HomeFooter';
import { Link } from 'react-router-dom';

const ExplorePage = () => {
    const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    const fetchFeedData = async ()=>{
      try{
        const res = await axios.get(`${API_URL}/getFeed` , {
          withCredentials: true
        })
        if(res.status === 200){
          setData(res.data.data);
          setLoading(false);
        }
        else{
          setError('Failed to fetch data');
          setLoading(false);
        }
      }catch(err){
        console.error('Error fetching feed data:', err);
        setError('An error occurred while fetching data');
        setLoading(false);
      }
    }
    fetchFeedData();
  } ,[]);
  
    
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
    <div>
       <div className='Explore-feed-container'>
        {data.map((item) => (
            
                <div className='Explore-post' key={item._id}>
                    {/* Media */}
                    <Link to="/contentDetails" state={{ post: item }} >
                    {item.mediaUrl.endsWith('.mp4') ? (
                        <video controls className='Explore-media-reel'>
                        <source src={`${API_URL}/${item.mediaUrl}`} type='video/mp4' />
                        Your browser does not support the video tag.
                        </video>
                    ) : (
                        <img
                        src={`${API_URL}/${item.mediaUrl}`}
                        className='Explore-media-image'
                        alt='feed content'
                        />
                    )}
                   </Link>
                </div>
            
        ))}
        </div>
        <HomeFooter/>
    </div>
  )
}

export default ExplorePage
