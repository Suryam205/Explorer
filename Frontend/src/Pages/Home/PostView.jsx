import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../../ConfigApi/Api';
import axios from 'axios';
import { FaTrash, FaHeart, FaRegHeart, FaRegComment } from 'react-icons/fa';
import '../../Styles/PostView.css';
import { FiSend } from "react-icons/fi";
import {fetchCommentsByPostId} from '../Comments/fetchCommentsByPostId'
import { toggleLikeSinglePost } from './HomeActions/FeedActions';
 


const PostView = ({ post, userId }) => {
  const [currentPost, setCurrentPost] = useState(post);
  const [liked, setLiked] = useState();
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const [commentsCount, setCommentsCount] = useState(0);

   

 useEffect(() => {
    async function loadCommentCount() {
      const comments = await fetchCommentsByPostId(currentPost._id);
      setCommentsCount(comments.length);
    }
    loadCommentCount();
  }, [currentPost._id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/userProfile`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          console.error('Failed to load user profile:', res.data.message);
        }
      } catch (err) {
        console.error('Failed to load user profile:', err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
  const fetchPost = async () => {
    try {
      const res = await axios.get(`${API_URL}/post/${post._id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setCurrentPost(res.data.post); // ✅ now currentPost.likes is fresh!
      }
    } catch (err) {
      console.error('Failed to fetch latest post:', err);
    }
  };

  fetchPost();
}, [post._id]);


  // const handleLike = async () => {
  //   try {
  //     const res = await axios.post(`${API_URL}/posts/like/${currentPost._id}`, {}, {
  //       withCredentials: true,
  //     });

  //     if (res.data.success) {

  //       setLiked(res.data.liked);
  //       setCurrentPost((prev) => ({
  //         ...prev,
  //         likes: res.data.liked
  //           ? [...prev.likes, user._id]
  //           : prev.likes.filter((id) => id !== user._id),
            
  //       }));
  //     }
  //   } catch (err) {
  //     console.error('Like failed:', err);
  //   }
  // };
   
const handleLike = () => {
  toggleLikeSinglePost(currentPost._id, user._id, setLiked, setCurrentPost);
};


 useEffect(() => {
  if (user._id && currentPost.likes) {
    setLiked(currentPost.likes.includes(user._id));
  }
}, [currentPost.likes, user._id]);




  const handleDeletePost = async () => {
    try {
      const res = await axios.delete(`${API_URL}/post/delete/${currentPost._id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        alert('Post deleted successfully');
        navigate('/userProfile');
      } else {
        console.log('Error while deleting the post');
      }
    } catch (err) {
      console.log('Error in try block', err.message);
    }
  };
 
  return (
    <div className='postView-container'>
      {/* User Info */}
      <div className='user-info'>
        <Link to={`/profile/${currentPost.userId}`}>
          <img
            src={`${API_URL}/${currentPost.userProfilePic.replace(/^\/+/, '')}`}
            
            alt={`${currentPost.fullName}'s profile`}
            className='profile-pic'
          />
        </Link>

        <Link to={`/profile/${currentPost.userId}`} className='text-decoration-none'>
          <span className='fullName'>{currentPost.fullName}</span>
        </Link>

        {currentPost.userId === user._id && (
          <button className='delete-btn-icon' onClick={handleDeletePost} title='Delete'>
            <FaTrash size={18} color='black' />
          </button>
        )}
      </div>

      {/* Media */}
      {currentPost.mediaUrl.endsWith('.mp4') ? (
        <video controls className='media'>
          <source src={`${API_URL}/${currentPost.mediaUrl}`} type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={`${API_URL}/${currentPost.mediaUrl}`}
          className='media'
          alt='feed content'
        />
      )}

      {/* Actions */}
      <div className="icon-row d-flex gap-1 ps-2 pt-2">
            <span onClick={handleLike}>
              {liked ? <FaHeart size={22} color='red' /> : <FaRegHeart size={22} />}
            </span>
            <span className='likes-count'>{currentPost.likes.length}</span>
            <Link to="/commentSection" state={{ postId: currentPost._id }} style={{ textDecoration: 'none', color: 'black' }}>
                  <span style={{ cursor: 'pointer' }}>
                      <FaRegComment size={20} />
                      <span className='likes-count'> {commentsCount}</span>
                  </span>
            </Link>
              <span style={{ cursor: 'pointer' }}>
                  <FiSend size={20} />
              </span>
      </div>


      {/* Description */}
      <p className='description'>
        {currentPost.fullName}:{currentPost.description}
      </p>

    </div>
  );
};

export default PostView;
