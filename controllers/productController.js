import sharp from "sharp";
import Product from "../models/productModel.js";
import catchAsync from "../utils/catchAsync.js";
import { getAll , getOne , deleteOne } from "./handelFactoryController.js";

const compressImage = async(file)=>{
    const filename = `${Date.now()}-${file.originalname.split(".")[0]}.png`;

    await sharp(file.buffer).resize(800, 800, {fit: "inside"}).png({compressionLevel: 9,}).toFile(`uploads/${filename}`);

    return filename;
};

const getAllProducts = getAll(Product);

const addProduct = catchAsync(async (req, res , next)=>{
    const images = [];

    const files = req.files || {};

    if(files.image1){
        images.push(await compressImage(req.files.image1[0]));
    };
    if(files.image2){
        images.push(await compressImage(req.files.image2[0]));
    };
    if(files.image3){
        images.push(await compressImage(req.files.image3[0]));
    };
    if(files.image4){
        images.push(await compressImage(req.files.image4[0]));
    };

    if (req.body.sizes) {
        req.body.sizes = JSON.parse(req.body.sizes);
    }

    if(images.length === 0){
        return next(new AppError('Please upload at least one image ', 400))
    }

   const product =  await Product.create({...req.body , image:images});

    res.status(201).json({
        status: "success",
        data:{
            product
        }
    })
});

const getProduct = getOne(Product);

const deleteProduct = deleteOne(Product);

const updateProduct = catchAsync(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new AppError("No product found with that id", 404));
    }


    let images = [...product.image];


    if (req.files) {

        if (req.files.image1) {
            images[0] = req.files.image1[0].filename;
        }

        if (req.files.image2) {
            images[1] = req.files.image2[0].filename;
        }

        if (req.files.image3) {
            images[2] = req.files.image3[0].filename;
        }

        if (req.files.image4) {
            images[3] = req.files.image4[0].filename;
        }

    }


    if (req.body.sizes) {
        req.body.sizes = JSON.parse(req.body.sizes);
    }


    if (req.body.bestseller) {
        req.body.bestseller = req.body.bestseller === "true";
    }


    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            ...req.body,
            image: images
        },
        {
            new: true,
            runValidators: true
        }
    );


    res.status(200).json({
        status: "success",
        data: {
            product: updatedProduct
        }
    });

});

const getBestSeller = catchAsync(async (req , res , next)=>{
    const products = await Product.find({bestseller: true}).limit(5);

    res.status(200).json({
        status:"success",
        results: products.lenght,
        data:{
            products
        }
    });
});

export {getAllProducts , addProduct , getProduct , deleteProduct , updateProduct , getBestSeller};