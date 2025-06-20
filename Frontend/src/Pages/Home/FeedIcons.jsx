import React, { useEffect, useState } from 'react'
import { toggleLike } from './HomeActions/FeedActions'
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { Link } from 'react-router-dom';
import {fetchCommentsByPostId} from '../Comments/fetchCommentsByPostId'

const FeedIcons = ({item , setLikedPosts , setData , likedPosts}) => {
   

 const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    async function loadCommentCount() {
      const comments = await fetchCommentsByPostId(item._id);
      setCommentsCount(comments.length);
    }
    loadCommentCount();
  }, [item._id]);




  return (
    <div>
        <div className="icon-row d-flex gap-2 ps-2 pt-2"> 
                      <span onClick={() => toggleLike(item._id, setLikedPosts, setData)} style={{ cursor: 'pointer' }}>
                        {likedPosts[item._id] ? <FaHeart color="red" size={20} /> : <FaRegHeart size={20} />}
                          
                      </span>
                      <Link to="/likedProfiles" state={{ postId: item._id }} style={{ textDecoration: 'none', color: 'black' }} >
                             <span className='likes-count'> {item.likes.length}</span>
                          </Link>
                      <Link to="/commentSection" state={{ postId: item._id }} style={{ textDecoration: 'none', color: 'black' }}>
                         <span style={{ cursor: 'pointer' }}>
                            <FaRegComment size={20} />
                               <span className='likes-count'> {commentsCount}</span>
                         </span>
                      </Link>
                      <span style={{ cursor: 'pointer' }}>
                        < FiSend size={20} />
                      </span>
                  </div>
    </div>
  )
}

export default FeedIcons
