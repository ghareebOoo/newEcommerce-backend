import express from "express";
import { signup , login , logout , protect , forgotPassword , resetPassword , updatePassword } from "../controllers/authController.js";
import { getMe , getUser} from "../controllers/userController.js";
const userRouter = express.Router();

userRouter.post('/signup' , signup);
userRouter.post('/login' , login);
userRouter.post('/logout' , logout);
userRouter.post('/forgotPassword' , forgotPassword);
userRouter.patch('/resetPassword/:token' , resetPassword);
userRouter.patch('/updatePassword' , protect , updatePassword);
userRouter.get('/me' , protect , getMe , getUser);


export default userRouter;