import mongoose from "mongoose";
import validator from "validator";


const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true , 'Product must have a name'],
        trim: true
    },
    description:{
        type: String,
        required:[true, 'Product must have a description'],
        trim: true
    },
    price:{
        type: Number,
        required:[true, 'Product must have a price'],
        min: [0, 'Price cannot be negative']
    },
    image:{
        type: [String],
        required: [true, ' Productmust have an image'],
        validate:{
            validator: arr => arr.length > 0,
            message: "Product must have at least one image"
        }
    },
    sizes:{
        type: [String],
        required: [true, 'Product must have a size'],
        validate:{
            validator: arr => arr.length > 0,
            message: "Product must have at least one size"
        }
    },
    category:{
        type: String,
        required:[true, 'Product must have a category'],
        enum:['Men' , 'Women' , 'Kids']
    },
    subCategory:{
        type: String,
        required:[true, 'Product must have a subCategory'],
        enum:['Topwear' , 'Bottomwear' , 'Winterwear']
    },
    bestseller:{
        type:Boolean,
        required:[true, 'Product must have a bestSeller'],
        default: false
    }
},{
    timestamps: true
});


const Product = mongoose.model('Product' , productSchema);

export default Product;