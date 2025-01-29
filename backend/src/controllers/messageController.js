import User from "../model/userModel.js";
import Message from "../model/messageModal.js";
import cloudinary from "../utils/cloudinary.js";
import { getReceiverSocketId,io } from "../utils/socket.js";


export const fetchusers = async(req ,res)=>{
  try{

    const loggeduserId = req.user._id;
    const filteredusers = await User.find({_id :{$ne:loggeduserId}}).select("-password")
    return res.status(200).json(filteredusers)
  }catch(error){
    console.log(error.Message)
    return res.status(500),json({Message:"Internal Server Error"})
  }
}


export const getmessages = async(req,res)=>{
  try{
//console.log('helooooooooooo');

    const myid = req.user._id;
  const  {id:frndId} = req.params;
  console.log(frndId)
  const messages = await Message.find({
    $or:[
      {senderId:myid,receiverId:frndId},
      {senderId:frndId,receiverId:myid}
    ]
  });
   
  return res.status(200).json({messages})
  }catch(error){
    console.log(error.Message);
    return res.status(500).json({Message:"Internal Servar Error"})
  }
}


export const sendMessages = async(req,res)=>{
  try{

    const myid = req.user._id;
    console.log(myid)
    const {text,image} =req.body;
    console.log(text)
    const {id:frndid }= req.params;
  console.log(frndid)
    let imageurl;
    if(image){
      const uploadresponse = await cloudinary.uploader.upload(image);
      imageurl = uploadresponse.secure_url;
    }
    const message = new Message({
      senderId:myid,
      receiverId:frndid,
      text:text,
      image:imageurl

    })

    await message.save();

    const receiverSocketId = getReceiverSocketId(frndid);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    res.status(201).json(message);



  }catch(error){
    console.log(error.messages);
    return res.status(500).json({messages:"Internal server Error"})
  }
}