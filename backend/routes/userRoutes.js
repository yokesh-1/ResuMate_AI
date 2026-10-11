import express from 'express';
import { getUserById, getUserResumes, loginuser, registeruser } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';


const userRouter = express.Router();

userRouter.post('/register' , registeruser )
userRouter.post('/login' ,loginuser)

// Routes (If i hit this Route ) -> Middleware (middleware checks) -> Controller (Logic inside the controller runs)
userRouter.get('/data' , protect ,getUserById )
userRouter.get('/resumes' ,protect , getUserResumes)

export default userRouter;