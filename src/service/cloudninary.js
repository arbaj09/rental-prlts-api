import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const UploadOnCloudinary= async(LOCALPATH)=>{
    try{
        if(!LOCALPATH) return null
        //Upload The fie on Cloudinary
        const response = await cloudinary.uploader.upload(LOCALPATH, {
          resource_type: "auto"
      })
   
        console.log("FIle is Uploaded on Cloudinary")
        fs.unlinkSync(LOCALPATH)
        return response;

    
    }
    catch (error){
        fs.unlinkSync(LOCALPATH)    // Remove the loacally saved file as the ulpload was not successful
        return null;
      
    }
    
}
export {UploadOnCloudinary}



// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });

