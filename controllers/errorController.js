import AppError from "../utils/appError.js";

const handleDuplicateErrorDB = err=>{
    const value = Object.keys(err.keyValue)[0];
    const message =`${value} already exists.`;
    return new AppError(message , 400)
};

const handleCastErrorDB =  err=>{
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message , 400);
};

const handleJWTError = ()=>{
    return new AppError('Invalid token. please login again.' , 401);
};

const handleJWTExpiredError = ()=>{
    return new AppError('Your token has expired. Please log in again.' , 401);
};

const sendErrorDev = (err, req, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, req, res) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }

    return res.status(500).json({
        status: "error",
        message: "Something went wrong",
    });
};



const globalErrorHandler = (err , req , res , next)=>{

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === "development"){
        sendErrorDev(err, req , res);
    }else if(process.env.NODE_ENV === "production"){
        let error = err;
        error.message = err.message;

        if(error.name === "CastError") error = handleCastErrorDB(error);
        if(error.code === 11000) error = handleDuplicateErrorDB(error);
        if(error.name === "JsonWebTokenError") error = handleJWTError();
        if(error.name === "TokenExpiredError") error = handleJWTExpiredError();
        sendErrorProd(error , req , res);
    }

};

export default globalErrorHandler;