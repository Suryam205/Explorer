import axios from 'axios';
import { API_URL } from '../../../../ConfigApi/Api';

export const toggleLike = async (postId, setLikedPosts, setData) => {

        try{
              const res = await axios.post(`${API_URL}/posts/like/${postId}`, {}, {
              withCredentials: true
            });
            if (res.data.success) {
               setLikedPosts((prev) => ({
                ...prev,
                [postId]: res.data.liked
              }));

              // Update local data to reflect new like count
              setData((prevData) =>  //here prevData is nothing but data value
                prevData.map((post) =>
                  post._id === postId
                    ? {
                        ...post,
                        likes: res.data.liked
                          ? [...post.likes, 'dummyUser'] // simulate +1
                          : post.likes.slice(0, -1)      // simulate -1
                      }
                    : post
                )
              );

            } else {
              console.error('Failed to like/unlike post:', res.data.message);
            }
            
        }catch(err){
            console.error('Error liking/unLiking post:', err);
        }
    }
 
 

export const getFeedData = async () => {
  try {
    const res = await axios.get(`${API_URL}/getFeed`, {
      withCredentials: true,
    });

    if (res.status === 200) {
      return res.data; // return the data
    } else {
      throw new Error('Failed to fetch data');
    }
  } catch (err) {
    console.error('Error fetching feed data:', err);
    throw err; // rethrow to handle in the component
  }
};

export const toggleLikeSinglePost = async (postId, userId, setLiked, setPost) => {
  try {
    const res = await axios.post(`${API_URL}/posts/like/${postId}`, {}, {
      withCredentials: true,
    });

    if (res.data.success) {
      setLiked(res.data.liked); // Set like icon state

      setPost(prevPost => ({
        ...prevPost,
        likes: res.data.liked
          ? [...prevPost.likes, userId]   // simulate like
          : prevPost.likes.filter(id => id !== userId) // simulate unlike
      }));
    }
  } catch (err) {
    console.error('Error toggling like on single post:', err);
  }
};
