import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Message from "../models/Message.js";


// Signup a new user
export const signup = async (req, resp)=>{
  const {fullName, email, password} = req.body;

  try {
    if(!fullName || !email || !password ){
      return resp.json({success: false, message:"Missing Details"})
    }
    const user = await User.findOne({email});

    if(user){
      return resp.json({success: false, message:"Account already exists"})
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt );

    const newUser = await User.create({
      fullName, email, password: hashedPassword, 
    });

    const token = generateToken(newUser._id)

    resp.json({success: true, userData: newUser, token, message:"Account created successfully" })
    
  } catch (error) {
    console.log(error.message);
    resp.json({success: false, message: error.message})
  }
}

// Controller to login a user
export const login = async (req, resp) =>{
  try {
     const {fullName, email, password} = req.body;
     const userData = await User.findOne({email})

     if(!userData){
      return resp.json({ success:false, message:"User not found" });
     }

     const isPasswordCorrect = await bcrypt.compare(password, userData.password);

     if(!isPasswordCorrect){
      return resp.json({success: false, message: "Invalid credentials"});
     }

     const token = generateToken(userData._id)

    resp.json({success: true, userData, token, message:"Login successful" })
    


  } catch (error) {
    console.log(error.message);
    resp.json({success: false, message: error.message})
  }
}

// Controller to check if user is authenticated
export const checkAuth = (req, res)=>{
  res.json({success: true, user:req.user});
}

// Controller to update user profile details
export const updateProfile = async (req, res)=>{
  try {
    const { profilePic, fullName} = req.body;

    const userId = req.user._id;
    let updatedUser;

    if(!profilePic){
      updatedUser = await User.findByIdAndUpdate(userId, { fullName}, {new: true});

    }else{
      const upload = await cloudinary.uploader.upload(profilePic);

      updatedUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url,  fullName}, {new: true});
    }
    res.json({success: true, user:updatedUser})
  } catch (error) {
    res.json({success: false, message: error.message})
  }
}


// Controller to get all users and unseen message counts
export const getAllUsersWithUnseenMessages = async (req, res) => {
  try {
    const authUserId = req.user._id;

    // Get all other users
    const users = await User.find({ _id: { $ne: authUserId } }).select(
      "_id fullName profilePic bio"
    );

    // Get unseen messages for authUser
    const unseenMessagesArr = await Message.find({
      receiver: authUserId,
      seen: false
    });

    const unseenMessages = {};
    unseenMessagesArr.forEach((msg) => {
      unseenMessages[msg.sender.toString()] =
        (unseenMessages[msg.sender.toString()] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      users,
      unseenMessages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};