import express from "express";
import dotenv from 'dotenv'; 
import authroutes from './routes/authroutes.js'
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/database.js";
import messageRoutes from './routes/messageRoutes.js'
import cors from "cors";
import path from 'path';
import { app, server } from "./utils/socket.js";

const __dirname = path.resolve();
//const app = express();
dotenv.config();
app.use(express.json({ limit: "10mb" })); // Adjust the size as needed
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


// if (process.env.NODE_ENV  === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }
app.use("/api/auth",authroutes);
app.use("/api/messages",messageRoutes);

const port = process.env.PORT ;
server.listen(port, () => {
  console.log(`Server is running on port ${ port}` );
  connectDB();
});
