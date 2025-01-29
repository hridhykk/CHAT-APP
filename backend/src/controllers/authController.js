

import { generateToken } from "../utils/jwt.js";
import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import cloudinary from "../utils/cloudinary.js";


export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log(req.body)
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser.email, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  console.log(req.body)
  const { email, password } = req.body;
  try {
   
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user.email, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
   
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editprofile = async(req,res)=>{
  try{
    console.log(req.body)
    const { profilePic} = req.body;
    const userId = req.user._id;

    if(! profilePic){
      return res.status(400).json({message:'profile pic required'});

    }
    //const base64Image = profilePic.replace(/^data:image\/\w+;base64,/, "");
    const base64Image = profilePic.replace(/^data:image\/\w+;base64,/, "");

    // Upload the base64 string to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`);

    // Update the user's profile with the Cloudinary URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    return res.status(200).json(updatedUser);
  }catch(error){
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
