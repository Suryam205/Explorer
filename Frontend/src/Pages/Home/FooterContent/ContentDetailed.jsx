import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { API_URL } from '../../../../ConfigApi/Api';
import HomeData from '../HomeData';
import HomeFooter from '../HomeFooter';
import PostView from '../PostView';



const ContentDetailed = ({post , userId }) => {

    const location = useLocation();
    if (!post) {
        post = location.state?.post; // Fallback to state if post prop is not provided
        userId = location.state?.userId; // Fallback to state if userId prop is not provided
        
    }
    
 
    
 
  return (
    <div className='content-detailed'>
        <PostView post={post} userId={userId} />
      
        { userId !== post.userId && ( <HomeData /> )}
          
        <HomeFooter />

    </div>

    
   
  )
}

export default ContentDetailed
