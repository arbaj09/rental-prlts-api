
import mongoose from "mongoose";


const UserSchema=new mongoose.Schema({

    FullName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        reduired:true
    },
    Number:{
        type:Number,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    Image:{
        type:String
    }



},{timestamps:true});



export const User=mongoose.model("User",UserSchema)