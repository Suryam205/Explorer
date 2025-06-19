import axios from 'axios';
import { API_URL } from '../../../ConfigApi/Api';

export async function fetchCommentsByPostId(postId) {
  try {
    const res = await axios.get(`${API_URL}/comments/getComments/${postId}`, { withCredentials: true });
    if (res.data.success) {
      return res.data.comments || [];
    } else {
      return [];
    }
  } catch (err) {
    console.error('Failed to fetch comments:', err);
    return [];
  }
}
