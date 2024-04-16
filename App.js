import MongoClient from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import Mongdb_connect from "./src/DB/Index.js";
import { Property } from "./src/models/property.models.js";
import {upload} from "./src/middleware/multer.js"
import {UploadOnCloudinary} from './src/service/cloudninary.js'
import { User } from "./src/models/user.model.js";
import bodyParser from "body-parser";
import { Booking } from "./src/models/booking.model.js";



// YOUR_BASE_DIRECTORY/netlify/functions/api.ts

import express from "express";
import serverless from "serverless-http";









dotenv.config({
  path: "./.env",
});

const app = express();











const port = process.env.PORT || 3000; // Choose a port for your API


// Middleware setup

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"))

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))



// MongoDB connection

Mongdb_connect();

// Create a new property listing
app.post("/api/property",upload.single("image"),async (req, res) => {
  const { title, description,price,owner,location,availableFromDate,propertyType} = req.body;
  if ([title, description,price,owner,location,availableFromDate,propertyType].some((field) => field?.trim() === ""))
   {  
    throw new Error("All fields are required");

    }
const ImageLocalPath = req.file.path;

 if(!ImageLocalPath){
  res.status(400).json({ error: "Image file is required" });

  throw new Error("Image  file  is required");
   
 }
  const Image= await UploadOnCloudinary(ImageLocalPath)

  if(!Image){
    throw new Error("Image  file  is required");

  }

Property.create({ title, description,price,owner,location,availableFromDate,propertyType,image:Image.url }).then((property) => {
  res.status(201).json(property);
})
.catch((err) => {
  console.error("Error creating property listing:", err);
  res.status(500).json({ error: "Error creating property listing" });
})

});


//create a user

app.post("/api/user", upload.single("Image") ,async(req, res) =>  {
try {
    const { FullName,Email ,Password,Number} = req.body;
    console.log(FullName)


     if(
      [FullName,Email,Password,Number].some((field) => field?.trim() === "")){
        throw new Error("All fields are required");
      }
  
      const profileImagePath = req.file.path;
      console.log("file pathe is," ,profileImagePath)
  
      if(!profileImagePath){
        res.status(400).json({ error: "Profile image is required" });
        throw new Error("Profile image is required");
       
      }
       
  
      const ProFilePic= await UploadOnCloudinary(profileImagePath)
      if(!ProFilePic){
        throw new Error("Profile image is required");
    
      }
     const existUser=  await User.findOne({
        $or: [
          {Email},{Number}
        ]
      })
      if(existUser){
        res.status(400).json({ error: "User already exists" });
        return 
      }
      
  
  
       User.create({ FullName,Email ,Password,Number,Image:ProFilePic.url }).then((user) => {
        res.status(201).json(user);
        
      })
} catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  
}})


app.post("/api/login", async (req, res) => {

  // take data from user 
  //match data from database
  //handle error while pass or emain incorrect
  //login success
try {
  const { FullName,Email ,Password,Number} = req.body;
    console.log(Email,Password)
  
    if(!Email||!Password){
  return res.status(400).json({error:"Email and Password are required"})
  
  }
  //find user 
   const user=   await User.findOne({Email})
   if(!user){
    return res.status(400).json({error:"User not found"})
     
   }
   //CHECK IF PASSWORD IS CORRECT
   const isPasswordCorrect=await User.findOne({Password})
   if(!isPasswordCorrect){
    return res.status(400).json({error:"Incorrect Password"})
     
   }
   res.status(201).json({"message":"login success"  ,user})
  

} catch (error) {
  console.error("Something went wrong:", error);
  res.status(400).json({ error: "Something went wrong during login" });
      
}
  
})


// Get all property listings
app.get("/api/list-properties", async (req, res) => {
  try {
    const properties = await Property.find({});
    res.send(properties);
    console.log(properties);
  } catch (error) {
    console.error("Error fetching property listings:", error);
  }
});

//FIND PROPERTY BY ID and show details

app.get("/api/propertyDetails/:id", async (req, res) => {
  try {
    const propertyDetails = req.params.id;


    console.log("id", propertyDetails);

    console.log( "FIND BY ID ",propertyDetails);
    const property = await Property.findById(propertyDetails);
    
    res.send(property);
    
  } catch (error) {
    console.error("Error fetching property details:", error);
    
  }
  
})

///Bookig a property 
app.post("/api/booking",async(req,res)=>{
 try {
       const{Email,fromDate,toDate ,propertyId}= req.body
 
       if(!Email||!propertyId||!fromDate||!toDate){
         return res.status(400).json({error:"All fields are required"})
       }
 
        const booking= await Booking.create({useId,propertyId,fromDate,toDate})
       res.status(201).json(booking)
 
     
 
    }catch (error) {
   console.error("Error creating booking......:", error);
  
 } })





  





// Update a property listing by ID
app.put("/api/property/:id", (req, res) => {
  const propertyId = req.params.id;
  const updatedProperty = req.body;
  Property.findByIdAndUpdate(
    propertyId,
    updatedProperty,
    { new: true },
    (err, property) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error updating property listing" });
      }
      res.json(property);
    }
  );
});

// Delete a property listing by ID
app.delete("/api/property/:id", async (req, res) => {
  const propertyId = req.params.id;
  console.log(propertyId);
  try {
    const deletedProperty = await Property.findByIdAndRemove(propertyId).exec();
    console.log("propety ID", deletedProperty);

    if (!deletedProperty) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(deletedProperty);
  } catch (error) {
    console.error("Error deleting property listing:", error);
    res.status(500).json({ error: "Error deleting property listing" });
  }
});
// //filter propert
app.get("/api/filter-properties", async (req, res) => {
  try {
    // Extract filter criteria from query parameters
    const { location, availableFromDate, price, propertyType } = req.query;



    // Build the filter object based on the received query parameters
    const filters = {};

    if (location) {
      filters.location = location;
    }

    if (availableFromDate) {
      filters.availableFromDate = {
        $gte: new Date(availableFromDate).toISOString,
      };
    }

    if (price) {
      filters.price = price;
    }

    if (propertyType) {
      filters.propertyType = propertyType;
    }

    // Use the filter object to query the database and retrieve filtered properties
    const filteredProperties = await Property.find(filters).exec();

    // Send the filtered properties as the response
    res.send(filteredProperties);
  } catch (error) {
    console.error("Error filtering properties:", error);
    res.status(500).json({ error: "Error filtering properties" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
