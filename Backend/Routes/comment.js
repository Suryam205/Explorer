const express = require('express');
const router = express.Router();
const userModel = require('../Models/user.model');


const { addComment , getComments , deleteComment} = require('../Controllers/commentController');

// Route to add a comment to a post

router.post('/addComment/:postId', addComment);
router.get('/getComments/:postId', getComments);
router.delete('/delete/:commentId' , deleteComment);


module.exports = router;

