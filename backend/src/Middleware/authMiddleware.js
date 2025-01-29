import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

export const protectRoutes = async (req,res , next)=>{
try{
  const token = req.cookies.jwt;

  if(!token){
    return res.status(400).json({message:"u dont have token bro,unautherized user"});
  
  }

  
  const decode = jwt.verify(token,process.env.JWTSECRET);
  



  if(!decode){
    return res.status(200).json({message:"ivalid token"});
  
  }
  const user = await User.findOne({email:decode.email}).select("-password");


  if(!user){
    return res.status(400).json({message:"user not found"});
  
  }
 
  req.user = user;
  console.log()
  next()
}catch(error){

  console.log(error.message);
  return res.status(500).json({message:"internal server error"})
}

}