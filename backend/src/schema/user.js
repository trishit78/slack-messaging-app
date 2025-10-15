import mongoose, { model } from "mongoose";

import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:[true,'Email already exists'],
    },
    password:{
        type:String,
        required:[true,'Password is required']
    },
    username:{
        type:String,
        required:[true,'Username is required'],
        unique:[true,'Username already exists'],
        minLength:[3,'Min characters should be 3']
    },
    avatar:{
        type:String,
    }

},{
    timestamps:true
});


userSchema.pre('save',function saveUser(next){
    const user = this;
    user.avatar = `https://robohash.org/${user.username}`;
    next()
})

userSchema.pre('save', function saveUser(next){
    const user= this;
    const salt = bcrypt.genSaltSync(9);
    const hashedPassword =bcrypt.hashSync(user.password, salt);
    user.password = hashedPassword;
    user.avatar = `https://robohash.org/${user.username}`; 
    next();
})

const User = model('User',userSchema);

export default User;