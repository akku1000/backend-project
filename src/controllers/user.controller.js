import {asyncHandler} from "../utils or utility/asyncHandler.js"
import { Apierror } from "../utils or utility/apierror.js";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils or utility/cloudinary.js";
import { ApiResponse } from "../utils or utility/apiresponse.js";


const generateAccessAndRefereshTokens=async(userId)=>{
    try {
        const user=await User.findById(userId);
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generatRefreshToken();
        
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false});
        return {accessToken,refreshToken};

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const registerUser=asyncHandler(async(req,res)=>{
    const{username,password,fullname,email}=req.body;
    // console.log(req.body);


    // if(
    //     [fullname,username,email,password].some((field)=>
    //     field?.trim()==="")
    // ){
    //    throw new Apierror(400,"A;; fields are required");
    // }

    if(fullname===""||username===""||password===""||email===""){
        throw new Apierror(400,"All fields are required");
    }
   
   const existedUser= await User.findOne({
    $or:[{username},{email}]
   })

   if(existedUser){
    throw new Apierror(409,"user already exist")
   }
  
   const avatarLocalPath=req.files?.avatar[0]?.path;
   const coverImagePath=req.files?.coverimage[0]?.path;
    //  console.log(req.files.coverimage)
    // console.log(avatarLocalPath);
    // console.log(coverImagePath)
    
   if(!avatarLocalPath||!coverImagePath){
    throw new Apierror(400,"Avatar or coverimage file req in local")
   }
   const avatar=await uploadOnCloudinary(avatarLocalPath);

   const coverimage=await uploadOnCloudinary(coverImagePath)

   if(!avatar){
      throw new Apierror(400,"avatar file req")
   }

  const user=await User.create({
    fullname,
    avatar:avatar.url,
    coverimage:coverimage?.url||"",
    email,
    password,
    username:username.toLowerCase()
   })

   const usercreated =  await User.findById(user._id).select(
    "-password -refreshToken"
   )
  
   if(!usercreated){
    throw new Apierror(500,"server register error")
   }

   return res.status(201).json(
    new ApiResponse(200,usercreated,"user register sucessfully")
   )
}) 
//registerUSer is a requesthander


const loginUser=asyncHandler(async(req,res)=>{
    // logic to build 
    // take data ->req.body()
    // check data is present or not
    // if present check in db
    // if find then check pass
    // sent token using cookie

    const {username,email,password}=req.body;

    if(!username||!email){
        throw new Apierror(400,"username or email not matched");
    }
    
    const user=await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new Apierror("400","Create Account");
    }

    const ispassword=await user.isPasswordCorrect(password);

    if(!ispassword){
        throw new Apierror(400,"Invalid Password");
    }
    
   const {accessToken,refreshToken}=await generateAccessAndRefereshTokens(user._id);

   const loggedInUser=await User.findById(user._id).
   select("-password -refreshToken");

   const option={
    httpOnly:true,
    secure:true
   }
    
   return res.status(200)
   .cookie("accessToken",accessToken,option)
   .cookie("refreshToken",refreshToken,option)
   .json(new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"User logged in successfully"))
})

const logoutUser=asyncHandler(async(req,res)=>{

    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    
    const option={
    httpOnly:true,
    secure:true
   }

   return res
   .status(200)
   .clearCookie("accessToken",option)
   .clearCookie("refreshToken",option)
   .json(new ApiResponse(200,{},"User Loggedout"))

})

export {registerUser,loginUser,logoutUser}


