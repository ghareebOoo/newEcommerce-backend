import Order from "../models/orderModels.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import catchAsync from "../utils/catchAsync.js";

const getDashboardStats = catchAsync(async (req , res , next)=>{
    const productCounts = await Product.countDocuments();
    const orderCounts = await Order.countDocuments();
    const userCounts = await User.countDocuments();

    const revenue = await Order.aggregate([
        {
            $group:{
                _id: null,
                totalRevenue:{
                    $sum:"$amount"
                }
            }
        }
    ]);

    const totalRevenue = revenue[0]?.totalRevenue || 0;

    res.status(200).json({
        status: "success",
        data:{
            products: productCounts,
            orders: orderCounts,
            users: userCounts,
            revenue: totalRevenue
        },
    })
});

const getOrderPerMonth = catchAsync(async(req , res , next)=>{
    const orders = await Order.aggregate([
        {
            $group:{
                _id:{$month: '$createdAt'},
                orders:{$sum: 1}
            }
        },
        {
            $sort:{_id: 1}
        }
    ]);

    res.status(200).json({
        status:"success",
        data:{
            orders
        }
    })
});

const getRevenuePerMonth = catchAsync(async(req , res , next)=>{
    const revenue = await Order.aggregate([
        {
            $group:{
                _id:{$month: "$createdAt"},
                revenue:{$sum: "$amount"}
            }
        },
        {
            $sort:{_id: 1}
        }
    ]);

    res.status(200).json({
        status:"success",
        data:{
            revenue
        }
    })
});

const getSalesByCategory =  catchAsync(async(req , res , next)=>{
    const salesByCategory =  await Order.aggregate([
        { $unwind: "$items" },

        {
            $lookup: {
            from: "products",
            localField: "items.productId",
            foreignField: "_id",
            as: "product",
            },
        },

        { $unwind: "$product" },

        {
            $group: {
            _id: "$product.category",
            sales: {
                $sum: "$items.quantity",
            },
            },
        },

        {
            $project: {
            _id: 0,
            category: "$_id",
            sales: 1,
            },
        },

        {
            $sort: {
            sales: -1,
            },
        },
    ]);

    res.status(200).json({
        status:"success",
        data:{
            salesByCategory
        }
    })
});


export {getDashboardStats , getOrderPerMonth , getRevenuePerMonth , getSalesByCategory};