const userModel = require("../Models/user.model");
const FeedModel = require("../Models/UserFeed.model");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;



const uploadFile = async (req, res) => {
  
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded'
      });
    }
    
    const { description } = req.body;

    // Check if the user is authenticated
    const token = req.cookies.token;
          if (!token) {
              return res.status(401).json({
                  success: false,
                  message: 'Unauthorized'
              });
          }  
    const decoded = jwt.verify(token, JWT_SECRET || "Surya123");
    const userId = decoded.id;
    const fullName = decoded.fullName;
    const userProfilePic = decoded.profilePic;

    if (!decoded || !userId || !fullName || !userProfilePic) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    

    const newFeed = new FeedModel({
      description: description || '',
      mediaUrl:  req.file?.url || req.file?.path,
      userId: userId,
      fullName: fullName,
      userProfilePic: userProfilePic || 'https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg'
    });

    await newFeed.save();

    return res.status(200).json({
      success: true,
      message: 'File uploaded and saved to DB successfully',
      data: newFeed
    });
  } catch (err) {
    console.error('File upload error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

const getFeedData = async (req, res) => {
  try {
    const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }
      const decoded = jwt.verify(token, JWT_SECRET || "Surya123");
      const userIdFromToken = decoded.id;
      if (!decoded || !userIdFromToken) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

    const feeds = await FeedModel.find({ userId: { $ne: userIdFromToken } }).sort({ createdAt: -1 });;
    
    res.status(200).json({
      success: true,
      message: 'Feed data retrieved successfully',
      data: feeds,
      currentUserId: userIdFromToken 
    });
  } catch (err) {
    console.error('Error fetching feeds:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const userPosts = await FeedModel.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'User posts retrieved successfully',
       userPosts
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

const handleLikesOnPost = async (req , res)=>{
    try{
      const postId = req.params.postId;
      if(!postId){
        return res.status(400).json({
          success: false,
          message: 'Post ID is required'
        });
      }
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }
      const decoded = jwt.verify(token, JWT_SECRET || "Surya123");
      const userIdFromToken = decoded.id;
      if (!decoded || !userIdFromToken) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }
      // Find the post by ID
      
      const post = await FeedModel.findById(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }


      const isLiked = post.likes.some(id => id.toString() === userIdFromToken);
      if (isLiked) {
        // If already liked, remove the user from likes
        post.likes = post.likes.filter(id => id.toString() !== userIdFromToken);
      } else {
        // If not liked, add the user to likes
        post.likes.push(userIdFromToken);
      }

      await post.save();
      
      res.status(200).json({
        success: true,
        message: 'Post liked/unLiked successfully',
        liked: !isLiked, // Return the new like status
        likesCount: post.likes.length // Return the updated likes count
      });
    }catch(err){
      console.error('Error handling likes on post:', err);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: err.message
      });
    }
}

const handleDeletePost = async (req , res) =>{
  try{

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    const decoded = jwt.verify(token, JWT_SECRET || "Surya123");
    const userIdFromToken = decoded.id;
    if (!decoded || !userIdFromToken) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const postId = req.params.postId
    if(!postId){
      return res.status(401).json({
        success:false,
        message:"No postId is received"
      })
    }
    const post = await FeedModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }
    // Check if the post belongs to the user
    if (post.userId.toString() !== userIdFromToken) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post"
      });
    }
    const deletedPost = await FeedModel.findByIdAndDelete(postId);
    
    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found or already deleted",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  }catch(err){
    return res.status(500).json({
        success:false,
        message:"Internal server error"
      })
  }
}

const fetchPost = async (req, res)=>{
  try {
    const post = await FeedModel.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ 
        success: false,
         message: "Post not found" 
        });
    }
    res.status(200).json({
       success: true, 
       post
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
       message: "Internal Server Error"
     });
  }
}

const fetchLikedProfiles = async (req, res) => {
  try {
    const { postId } = req.params;
  
   const post = await FeedModel.findById(postId).populate('likes', 'fullName profilePic');
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
  
    return res.status(200).json({
      success: true,
      likedProfiles: post.likes
    });

  } catch (err) {
    console.error('Fetch liked profiles error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message  
    });
  }
};




module.exports = {
  uploadFile,
  getFeedData,
  getUserPosts,
  handleLikesOnPost,
  handleDeletePost,
  fetchPost,
  fetchLikedProfiles
};
