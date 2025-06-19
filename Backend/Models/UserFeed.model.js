const mongoose = require('mongoose');

const FeedSchema = new mongoose.Schema({
  
  description: {
    type: String
  },
  mediaUrl: {
    type: String,
    required: true
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
    required: true
  }, 
  fullName: {
    type: String,
    required: true
  },
  userProfilePic: {
    type: String,
    default: 'https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg'
  },
  likes:{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const FeedModel = mongoose.model('Feed', FeedSchema);
module.exports = FeedModel;
