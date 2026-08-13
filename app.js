import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";
import { stripeWebhook } from "./controllers/orderController.js";

const app = express();

app.use(cookieParser());

app.use(cors({origin:[ 'http://localhost:5173', "http://localhost:5174" ] , credentials: true}));

app.use("/images", express.static("uploads"));

app.post("/api/newEcommerce/orders/webhook", express.raw({type:"application/json"}), stripeWebhook);

app.use(express.json());

app.use('/api/newEcommerce/users' , userRouter);
app.use('/api/newEcommerce/products' , productRouter);
app.use('/api/newEcommerce/cart' , cartRouter);
app.use('/api/newEcommerce/orders' , orderRouter);
app.use('/api/newEcommerce/dashboard' , dashboardRouter);

app.all('/{*splat}' , (req , res , next)=>{
    next(new AppError(`can not find the ${req.originalUrl} on this server!` , 404));
});

app.use(globalErrorHandler);

export default app;

