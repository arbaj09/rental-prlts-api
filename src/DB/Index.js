
import mongoose from "mongoose";



const Mongdb_connect= async()=>{

    try{
  
      await mongoose.connect(process.env.MONGODB_URI,);
        console.log("Connection Succesfull")
    }
    catch(error){
      console.log("Failed to connecting! ",error)
  

  
  
      
  }}
  export default Mongdb_connect;