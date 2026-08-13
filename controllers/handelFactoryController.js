import APIFeatures from "../utils/apiFeatures.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

const getOne = (Model , popOptions)=> catchAsync( async (req , res , next)=>{
    let query = Model.findById(req.params.id);
    
    if(popOptions) query = query.populate(popOptions);

    const doc = await query;

    if(!doc){
        return next(new AppError('No document found with that Id' , 404));
    };

    res.status(200).json({
        status:"success",
        data:{
            data:doc
        }
    });
});

const deleteOne = (Model)=> catchAsync( async (req , res , next)=>{
    
    const doc = await Model.findByIdAndDelete(req.params.id);

    if(!doc){
        return next(new AppError('No document found with that Id' , 404));
    };

    res.status(204).json({
        status:"success",
        data:{
            data: null
        }
    });
});

const updateOne = Model => catchAsync(async (req , res , next)=>{
    console.log(req.body);
    console.log(req.files);
    
    const doc = await Model.findByIdAndUpdate(req.params.id , req.body , {new: true , runValidators: true});

    if(!doc){
        return next(new AppError('No document found with that id' , 404))
    };

    res.status(200).json({
        status: "success",
        data:{
            doc
        }
    })
});

const getAll = Model => catchAsync(async (req, res, next) => {

    const features = new APIFeatures(Model.find(), req.query).filter().search();

    const filter = features.query.getFilter();

    const totalProducts = await Model.countDocuments(filter);

    features.sort().paginate();

    const products = await features.query;

    const totalPages = Math.ceil(totalProducts / features.limit);

    res.status(200).json({
        status: "success",
        results: products.length,
        totalProducts,
        totalPages,
        currentPage: features.page,
        data: {
            products
        }
    });

});


export {getOne , getAll , deleteOne , updateOne};