const FeedModel = require("../Models/UserFeed.model");
const jwt = require("jsonwebtoken");
const CommentModel = require("../Models/comment.model");
const userModel = require('../Models/user.model');



const addComment = async (req, res) => {
  try {
    const postId  = req.params.postId;
    const { text: comment } = req.body;

    //  Check if user is authenticated
     const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
    }
    console.log('Received token:', token);


    //  Decode token to get user info
    const decoded = jwt.verify(token, 'Surya123');
    const userId = decoded.id;
    const fullName = decoded.fullName;
    const userProfilePic = decoded.profilePic;

    if (!decoded || !userId || !fullName || !userProfilePic) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Check if the post exists
    const post = await FeedModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    //  Create and save the comment
    const newComment =  new  CommentModel({
      postId,
      userId,
      fullName,
      userProfilePic,
      date: new Date(),
      text: comment,
    });

    await newComment.save();

    return res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      comment: newComment,
    });

  } catch (err) {
    console.error('Add comment error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

const getComments = async (req , res) =>{
    try{
        const postId = req.params.postId;
        if(!postId){
            return res.status(400).json({
                success: false,
                message: 'Post ID is required'
            });
        }
        const comments = await CommentModel.find({ postId }).sort({ date: -1 });
        if (comments.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No comments yet. Be the first to comment!',
                comments: []
            });
        }
       
        return res.status(200).json({
            success: true,
            message: 'Comments retrieved successfully',
            comments
        });
    }catch (err) {
        console.error('Get comments error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
}

const deleteComment = async (req , res)=>{
    try{

         const token = req.cookies.token;
            if (!token) {
              return res.status(401).json({
                success: false,
                message: 'Unauthorized'
              });
            }
            const decoded = jwt.verify(token, "Surya123");
            const userIdFromToken = decoded.id;
            if (!decoded || !userIdFromToken) {
              return res.status(401).json({
                success: false,
                message: 'Unauthorized'
              });
            }
        
        const commentId = req.params.commentId;
        if(!commentId){
            return res.status(401).json({
                success: false,
                message:"No commentId received"
            })
        }

        // Check if the comment exists and belongs to the user
        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }
        if (comment.userId.toString() !== userIdFromToken) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this comment"
            });
        }
        // Delete the comment
        const CommentToDelete = await CommentModel.findByIdAndDelete(commentId)
        if(!CommentToDelete){
            return res.status(401).json({
                success: false,
                message: "comment not found"
            })
        }
        return res.status(200).json({
            success: true,
            loggedInUserId: userIdFromToken,
            commentUserId: comment.userId,
            message:"Comment deleted successfully"
        })
    }catch(err){
         return res.status(500).json({
                success: false,
                message: "Internal server error"
            })
    }
}


module.exports = {
    addComment,
    getComments,
    deleteComment
};