import stripe from "../config/stripe.js";
import Order from "../models/orderModels.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { getAll } from "./handelFactoryController.js";


const getAllOrders = getAll(Order); 

const deleteAllOrders = catchAsync( async(req , res , next)=>{
    const result = await Order.deleteMany({});

    res.status(200).json({
        status: "success",
        message: `${result.deletedCount} Orders deleted successfully`,
        data: null
    });
});

const updateOrder = catchAsync(async (req , res , next)=>{
    const {status} = req.body;

    const order = await Order.findByIdAndUpdate(req.params.id , {status} , {new: true , runValidators: true});

    if(!order){
        return next(new AppError('Order not found' , 404))
    };

    res.status(200).json({
        status: "success",
        data:{
            order
        }
    });
});

const placeOrderCod = catchAsync(async (req , res , next)=>{
    const userId = req.user._id;

    const {items , address} = req.body;

    let amount = 0;

    const orderItems = [];

    for(const item of items){
        const product = await Product.findById(item.product);

        if(!product){
            return next(new AppError('Product not found', 404));
        };

        amount += product.price * item.quantity;

        orderItems.push({
            productId: product._id,
            name: product.name,
            image: product.image[0],
            price: product.price,
            size: item.size,
            quantity: item.quantity,
        });

    };

    const orderData = {
        userId,
        items:orderItems,
        address,
        amount,
        paymentMethod: "COD",
        payment: false,
    };

    const newOrder = new Order(orderData);

    await newOrder.save();

    await User.findByIdAndUpdate(userId , {cartData:{}});

    res.status(200).json({
        status: "success",
        message:"Order placed"
    });

});

const placeOrderStripe = catchAsync(async (req , res , next)=>{
    const {items , address} = req.body;

    const userId =   req.user._id;

    let amount = 0;

    const line_items = [];

    const orderItems = [];

    for(const item of items){
        const product = await Product.findById(item.product);

        if(!product){
            return next(new AppError('Product not found', 404));
        };

        amount += product.price * item.quantity;
        
        orderItems.push({
            productId: product._id,
            name: product.name,
            image: product.image[0],
            price: product.price,
            size: item.size,
            quantity: item.quantity,
        });

        line_items.push({
            price_data:{
                currency:"usd",

                product_data:{
                    name:product.name
                },

                unit_amount:product.price * 100
            },

            quantity:item.quantity
        });
    };

    const orderData = {
        userId,
        items:orderItems,
        address,
        amount,
        paymentMethod: "Stripe",
        payment: false,
    };

    const newOrder = new Order(orderData);

    await newOrder.save();

    const session = await stripe.checkout.sessions.create({
        line_items,

        mode: 'payment',

        metadata:{
            orderId:newOrder._id.toString(),
            userId:userId.toString()
        },

        success_url:`${process.env.FRONTEND_URL}/success`,

        cancel_url:`${process.env.FRONTEND_URL}/cart`
    });

    res.status(200).json({
        status:"success",
        session_url: session.url
    })

});

const stripeWebhook = async (req , res , next)=>{

    const sig = req.headers["stripe-signature"];

    let event;
        
    try{
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }catch(err){
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if(event.type === "checkout.session.completed"){

        console.log(event.type);

        const session = event.data.object;


        const orderId = session.metadata.orderId;


        await Order.findByIdAndUpdate(orderId,{
            payment:true,
            status:"Paid"
        });


        await User.findByIdAndUpdate(session.metadata.userId,{
            cartData:{}
        });


    };


    res.status(200).json({
        received:true
    });

};

const userOrders = catchAsync(async (req , res , next)=>{
    const userId = req.user._id;

    const orders = await Order.find({userId}).sort('-createdAt');

    res.status(200).json({
        status: "success",
        results: orders.length,
        orders
    });
});

export {getAllOrders , deleteAllOrders , updateOrder , placeOrderStripe , stripeWebhook , placeOrderCod , userOrders};