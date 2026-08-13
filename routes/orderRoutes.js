import express from "express";
import { protect , restrictTo } from "../controllers/authController.js";
import { getAllOrders , deleteAllOrders , updateOrder , placeOrderStripe , placeOrderCod , userOrders} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.get('/' , protect , restrictTo('admin') , getAllOrders);

orderRouter.delete('/deleteAll' , protect , restrictTo('admin') , deleteAllOrders);

orderRouter.patch('/:id/status' , protect , restrictTo('admin') , updateOrder);

orderRouter.post('/cod' , protect , placeOrderCod);

orderRouter.post('/stripe' , protect , placeOrderStripe);

orderRouter.get('/userOrders' , protect , userOrders);

export default orderRouter;