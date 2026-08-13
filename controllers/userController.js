import User from "../models/userModel.js";
import { getOne } from "./handelFactoryController.js";

const getMe = (req , res , next)=>{
    req.params.id = req.user.id
    next();   
};

const getUser = getOne(User);

export {getMe , getUser};