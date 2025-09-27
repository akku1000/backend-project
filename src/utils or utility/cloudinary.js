import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"
dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});
// console.log(process.env.CLOUDINARY_CLOUD_NAME)
// console.log(process.env.CLOUDINARY_CLOUD_NAME)
// console.log(process.env.CLOUDINARY_API_SECRET)

const uploadOnCloudinary=async(localFilePath)=>{
    try {
        if(!localFilePath) return null;
        
        //upload 

        const res= await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        });

        // file has been uploaded successfully

        console.log("file is uploaded on cloudinary",res);
        return res;
        
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove locally saved temporary file as upload operation got failed
        // console.log(error)
        return null;
    }
}

export {uploadOnCloudinary}