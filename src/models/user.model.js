import mongoose, {Schema} from "mongoose";
import jwt from 'jsonwebtoken'  
import bcrypt from 'bcrypt'
const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        index:true,
        lowercase:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    fullname:{
       type:String,
       required:true,
       trim:true,
       index:true
    },
    avatar:{
        type:String,//cloudnary url
        required:true
    },
    coverimage:{
      type:String,
    },
    watchHistory:[
           {
            type:Schema.Types.ObjectId,
            ref:"video"
           }
    ],
    password:{
        type:String,
        required:[true,'Password is required'],
        
    },
    refreshToken:{
        type:String
    }
    

},{timestamps:true});


userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();

    this.password=await bcrypt.hash(this.password,10);
    next()
}) //no callback fn bacuz we dont have (this) reference in callback

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken=function(){
 return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )  //payload
}

userSchema.methods.generatRefreshToken=function(){
     return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    ) 
}

export const User=mongoose.model("User",userSchema);