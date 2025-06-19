import React from 'react'
import { API_URL } from '../../../ConfigApi/Api';
import { useState } from 'react';
import axios from 'axios';
import '../../Styles/PostComments.css';


const PostComments = ({ postId, onNewComment }) => {
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setSubmitting(true);
      const res = await axios.post(`${API_URL}/comments/addComment/${postId}`,
        { text: comment },
        { withCredentials: true }
      );

      if (res.data.success) {
          setComment('');
          const newComment = res.data.comment;
          if (onNewComment) {
            onNewComment(newComment);    // notify parent about new comment
          } 

      } else {
          console.error('Comment failed:', res.data.message);
      }

      } catch (err) {
        console.error('Error submitting comment:', err);
      } finally {
        setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form d-flex gap-2 mt-2">
      <input
        type="text"
        className="form-control"
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={submitting}
      />
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
};

export default PostComments


