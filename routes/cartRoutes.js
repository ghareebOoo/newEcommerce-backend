import express from "express";
import { protect } from "../controllers/authController.js";
import { addToCart , updateCart , deleteFromCart , deleteAll , getUserCart} from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.post('/add' , protect , addToCart);
cartRouter.patch('/update' , protect , updateCart);
cartRouter.delete('/delete' , protect , deleteFromCart);
cartRouter.delete('/deleteAll' , protect , deleteAll);
cartRouter.get('/userCart' , protect , getUserCart);

export default cartRouter;