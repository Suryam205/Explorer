const express = require('express');
const router = express.Router();
const upload = require('../Utils/multerConfig');
const uploadController = require('../Controllers/uploadController');

// Route to handle single file upload
router.post('/addFeed', upload.single('media'), uploadController.uploadFile);
router.get('/getFeed' , uploadController.getFeedData);
router.get('/posts/:userId', uploadController.getUserPosts);
router.post('/posts/like/:postId', uploadController.handleLikesOnPost);
router.delete('/post/delete/:postId' , uploadController.handleDeletePost)
router.get('/post/:postId', uploadController.fetchPost);
router.get('/posts/likedProfiles/:postId', uploadController.fetchLikedProfiles);



module.exports = router;
