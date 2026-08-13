import express from "express";
import { getAllProducts , addProduct , getBestSeller , getProduct , deleteProduct , updateProduct } from "../controllers/productController.js";
import { protect, restrictTo } from "../controllers/authController.js";
import upload from "../multer/multer.js";
const productRouter = express.Router();

productRouter.get('/' , getAllProducts);
productRouter.post('/add' , upload.fields([{name: 'image1' , maxCount: 1},{name:'image2' , maxCount:1},{name:"image3",maxCount:1},{name:'image4',maxCount:1}]) , addProduct);
productRouter.get('/bestSeller' , getBestSeller);
productRouter.get('/:id' , getProduct);
productRouter.patch('/:id' , upload.fields([{ name: "image1", maxCount: 1 }, { name: "image2", maxCount: 1 }, { name: "image3", maxCount: 1 }, { name: "image4", maxCount: 1 }]), updateProduct);
productRouter.delete('/:id' , protect , restrictTo('admin') , deleteProduct);


export default productRouter;