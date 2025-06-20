const { createTokenForUser } = require('../Authentication/auth');
const userModel = require('../Models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const FeedModel = require('../Models/UserFeed.model');
const JWT_SECRET = process.env.JWT_SECRET;


const signupUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const profilePic = req.file ? req.file.path : null;

   // const profilePic = req.file ? req.file.filename : null;

    if (!fullName || !email || !password || !profilePic) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all the fields'
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      fullName,
      email,
      password: hashedPassword,
      profilePic: profilePic

      // profilePic: `/uploadsProfiles/${profilePic}`, // save file path
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });

  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};


const signinUser = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        // Validate input
        if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please fill all the fields'
        });
        }
    
        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
        }
    
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
        }

        // Set session cookie
        const token = createTokenForUser(user);

        
        return res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        }).status(200).json({
        success: true,
        message: "User logged in successfully",
        token,
        });
    
    } catch (err) {
        console.error('Signin error:', err);
        return res.status(500).json({
        success: false,
        message: 'Server error',
        error: err.message  
        });
    }
};
  
const protectedRoute = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
    
       
        const decoded = jwt.verify(token, JWT_SECRET || "Surya123");
        
        if(decoded){
            return res.status(200).json({
            success: true,
            message: 'Protected route accessed',
           
        });
        }
    } catch (err) {
        console.error('Protected route error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message  
        });
    }
};

const fetchAllProfiles = async (req , res) =>{
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    const decoded = jwt.verify(token, JWT_SECRET || "Surya123");
    if(!decoded){
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    // Fetch all user profiles except the logged-in user
    const user = await userModel.findById(decoded.id, { password: 0 });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    // Exclude the logged-in user from the profiles list
    const userId = user._id;
   
    // Fetch all profiles except the logged-in user
    // Exclude the logged-in user from the profiles list
    const profiles = await userModel.find({ _id: { $ne: userId } }, { password: 0 });
    if (profiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No profiles found'
      });
    }
    return res.status(200).json({
      success: true,
      profiles
    });
    
  }catch (err) {
    console.error('Fetch profiles error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message  
    });
  }
}

const fetchProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id, { password: 0 });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    return res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    console.error('Fetch profile error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message  
    });
  }
};

const fetchFollowers = async (req , res) =>{
  try{
    const userId = req.params.userId;
     if (!userId) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const followers = await userModel.findById(userId).populate('followersList', { password: 0 });
    if (followers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No followers found'
      });
    }

     
    return res.status(200).json({
      success: true,
      followers: followers.followersList
      
    });
  }
  catch(err){
    console.error('Fetch followers error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message  
    });
  }
}

const fetchFollowingList = async (req, res) =>{
   try{
     const userId = req.params.userId;
     if (!userId) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    const following = await userModel.findById(userId).populate('followingList', { password: 0 });
    if (following.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No followers found'
      });
    }
    console.log(following.followingList);
    return res.status(200).json({
      success: true,
      following: following.followingList
      
    });



   }catch(err){
      console.error('Fetch followers error:', err);
      return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message  
    });
   }
}

const fetchFollowersCount = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET || "Surya123");
    const LoggedUser = await userModel.findById(decoded.id);

    if (!LoggedUser) {
      return res.status(404).json({
        success: false,
        message: 'Logged-in user not found'
      });
    }

    const targetUser = await userModel.findById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found"
      });
    }

    const isFollowing = targetUser.followersList.includes(LoggedUser._id);

    if (!isFollowing) {
      // Follow user
      targetUser.followersList.push(LoggedUser._id);
      targetUser.followers += 1;

      LoggedUser.followingList.push(targetUser._id);
      LoggedUser.following += 1;
    } else {
      // Unfollow user
      targetUser.followersList.pull(LoggedUser._id);
      targetUser.followers -= 1;

      LoggedUser.followingList.pull(targetUser._id);
      LoggedUser.following -= 1;
    }

    await targetUser.save();
    await LoggedUser.save();

    return res.status(200).json({
      success: true,
      message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
      updatedFollowerCount: targetUser.followers,
      updatedFollowingCount: LoggedUser.following,
      isFollowing: !isFollowing,
    });

  } catch (err) {
    console.error('Fetch followers count error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

const fetchLoggedInUser = async(req , res) =>{
  try{
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET || "Surya123");
    if(!decoded){
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    const user = await userModel.findById(decoded.id, { password: 0 });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    return res.status(200).json({
      success: true,
     
      user
    });
  }catch(err){
    console.error('Fetch logged in user error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message  
    });
  }
}

const handleLogout = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      success: true,
      message: 'User logged out successfully'
    });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message  
    });
  }
}





module.exports = {
  signupUser,
  signinUser,
  protectedRoute,
  fetchAllProfiles,
  fetchProfile,
  fetchFollowers,
  fetchFollowersCount,
  fetchLoggedInUser,
  handleLogout,
  fetchFollowingList,
  
  
};
 

