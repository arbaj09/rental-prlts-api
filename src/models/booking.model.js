  

  import mongoose from "mongoose";

  const BookingSchema= new mongoose.Schema({

    propertyId:{
      type:String,
      required:true
    },
    userId:{
      type:String,
      required:true
    },
    fromDate:{
      type:Date,
      required:true
    },
    toDate:{
      type:Date,
      required:true
    },
   




  },{timestamps:true})

    export const Booking=mongoose.model("Booking",BookingSchema)



