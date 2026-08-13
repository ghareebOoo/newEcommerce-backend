import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

const addToCart = catchAsync(async (req , res , next)=>{
        const {itemId , size} = req.body;

        if(!itemId || !size){
            return next(new AppError('Please provide both itemId and size.' , 400));
        };

        const userData = req.user;

        let cartData = userData.cartData || {};

        if(!cartData[itemId]){
            cartData[itemId] = {};
        };

        cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

        await User.findByIdAndUpdate(req.user._id, { cartData }, {new: true});

        res.status(201).json({
            status: "success",
            message: "Add to cart",
            cartData
        });
});

const updateCart = catchAsync(async (req , res , next)=>{
        const {itemId , size , quantity} = req.body;

        if(!itemId || !size || !quantity){
            return new AppError("itemId, size, and quantity are required.", 400);
        };

        const userData = req.user;

        let cartData = userData.cartData || {};

        if(cartData[itemId] && cartData[itemId][size] !== undefined){

            if(quantity === 0){
                delete cartData[itemId][size];

                if(Object.keys(cartData[itemId]).length === 0){
                    delete cartData[itemId];
                };
            }else{
                cartData[itemId][size] = quantity;
            };
        };

        await User.findByIdAndUpdate(userData._id , {cartData} , {new: true});

        res.status(200).json({
            status: "success",
            message: "Updated successfully",
            cartData
        });
});

const deleteFromCart = catchAsync(async (req , res , next)=>{
    const {itemId , size} = req.body;

    if(!itemId || !size){
        return next(new AppError('Please provide both itemId and size.' , 400));
    };

    const userData = req.user;

    let cartData = userData.cartData || {};

    if(cartData[itemId] && cartData[itemId][size] !== undefined){
        delete cartData[itemId][size];
    };

    if(cartData[itemId] && Object.keys(cartData[itemId]).length === 0){
        delete cartData[itemId];
    };

    await User.findByIdAndUpdate(userData._id , {cartData} , {returnDocument: 'after'});

    res.status(200).json({
        status: "success",
        message: "Product deleted successfully",
        data: null
    });

});

const deleteAll = catchAsync(async (req , res , next)=>{
    const userData = req.user;

    let cartData = userData.cartData || {};

    cartData = {};

    await User.findByIdAndUpdate(userData._id , {cartData} , {new: true});

    res.status(200).json({
        status: "success",
        message: "Products deleted successfully",
        data: null
    });
});


const getUserCart = catchAsync(async (req , res , next)=>{

    res.status(200).json({
        status: "success",
        cartData: req.user.cartData || {}
    });
});

export {addToCart , updateCart , deleteFromCart , deleteAll , getUserCart};