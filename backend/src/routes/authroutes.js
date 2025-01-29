


import express from "express";
const router = express.Router();
import { login,signup,logout,editprofile,checkAuth } from '../controllers/authController.js';
import { protectRoutes } from "../Middleware/authMiddleware.js";

router.post('/login', login);
router.post('/signup',signup);
router.post('/logout' ,logout);
router.put('/editprofile',protectRoutes,editprofile);
router.get('/check',protectRoutes,checkAuth)

export default router;