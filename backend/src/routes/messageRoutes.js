import express from 'express'
const routes = express.Router();
import { fetchusers,getmessages,sendMessages } from '../controllers/messageController.js';
import { protectRoutes } from '../Middleware/authMiddleware.js';

routes.get('/fetchuser',protectRoutes,fetchusers);
routes.get('/getmessages/:id',protectRoutes,getmessages);
routes.post('/sendmessages/:id',protectRoutes,sendMessages);

export default routes;