import mongoose from "mongoose";
import validator from "validator";


const orderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:[true , 'Order must have an userId']
    },
    items:[
        {
            productId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            name:{
                type: String,
                required: true
            },
            image:{
                type: String,
                required: true
            },
            price:{
                type: Number,
                required: true
            },
            size:{
                type: String
            },
            quantity:{
                type: Number,
                required: true,
                min:[1, 'Quantity must be at least 1']
            }
        }
    ],
    amount:{
        type: Number,
        required:[true, 'Order must have an amount'],
        min: [0, 'Amount cannot be negative']
    },
    address:{
        type: Object,
        required:[true,'Order must have an address']
    },
    status:{
        type: String,
        enum:['Order Placed' , 'Packing' , 'Shipped' , 'Out for delivery' , 'Delivered'],
        default: 'Order Placed'
    },
    paymentMethod:{
        type: String,
        enum:['COD' , 'Stripe'],
        required:[true, 'Order must have a paymentMethod'],
    },
    payment:{
        type: Boolean,
        default: false
    },
},{
    timestamps: true
});


const Order = mongoose.model('Order' , orderSchema);

export default Order;