import mongoose from "mongoose";
import dotenv from 'dotenv';
import Product from "../models/productModel.js";
import { products } from "../data/products.js";

dotenv.config();

const DB = process.env.DATABASE_LOCAL;

const seedProducts = async ()=>{
    try{
        
        await Product.deleteMany({});
        
        await Product.insertMany(products);

        console.log('Products inserted successfully');

        process.exit();
    }catch(err){
        console.log(err);

        process.exit(1);
    };
};

mongoose.connect(DB , {}).then(()=> {console.log("DB connected successfully"); seedProducts()});