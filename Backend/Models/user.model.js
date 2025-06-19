const {Schema , model} = require('mongoose');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: 'https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg',
    },
     posts: {
        type: Number,
        default: 0,
    },
    followers: {
        type: Number,
        default: 0,
    },

    following: {
        type: Number,
        default: 0,
    },

    followersList: [{
      type: Schema.Types.ObjectId,
      ref: 'user',
    }],

    followingList: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
     }],

   
    bio: {
        type: String,
        default: 'This is my bio',
    },
    
}, {timestamps:true});

const userModel = model('user', userSchema);
module.exports = userModel;
