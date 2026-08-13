import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt';
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true , 'Please tell us your name'],
        trim: true
    },
    email:{
        type: String,
        required:[true, 'Please proivde your email'],
        unique: true,
        lowercase: true,
        validate:[validator.isEmail , 'Please provide a valid email']
    },
    password:{
        type: String,
        required:[true, 'Please proivde your password'],
        minlength: 8,
        select: false
    },
    passwordConfirm:{
        type: String,
        required:[true, 'Please proivde your passwordConfirm'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        },
    },
    role:{
        type: String,
        enum:['user' , 'admin'],
        default: 'user'
    },
    cartData:{
        type: Object,
        default: {}
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
},{
    minimize: false,
  });

userSchema.pre('save' , async function(){
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password , 12);
    this.passwordConfirm = undefined;
});

userSchema.pre('save' , function(){
    if(!this.isModified('password') || this.isNew);

    this.passwordChangedAt = Date.now() - 1000;
});

userSchema.methods.correctPassword = async function(canidatePassword , userPassword){
    return await bcrypt.compare(canidatePassword , userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000 , 10);
        
        return JWTTimestamp < changedTimestamp;
    };

    return false;
};

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User' , userSchema);

export default User;