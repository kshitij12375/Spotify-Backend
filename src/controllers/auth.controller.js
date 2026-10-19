
const userModel = require('../models/user.model');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');


async function registerUser(req,res){

    const {username,email,password,role="user"}=req.body;

    const isExistUser=await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    });

    if(isExistUser){
        return res.status(409).json({
            "message":"user already exists"
        })
    }

    const hash=await bcrypt.hash(password,10)

    const user=await userModel.create({
        username,
        email,
        password:hash,
        role
    })

    const token=jwt.sign({
        id:user._id,
        role:user.role
    },process.env.SECRET_KEY)
  

    res.cookie("token",token);

    res.status(201).json({
        "message":"User registers successfully",
        user
    })

}


async function loginUser(req,res){
    const {username,email,password}=req.body;


    const user=await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(!user){
        return res.status(401).json({
            "message":"Invalid Credentials"
        })
    }

    const isPasswordValid=await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
        return res.status(401).json({
            "message":"Invalid credentials "
        })
    }


    const token=jwt.sign({
        id:user._id,
        role:user.role
    },process.env.SECRET_KEY)


    res.cookie("token",token);


    res.status(201).json({
        "message":"User Login successfully",
        user
    })
}

async function logoutUser(req,res){
    
        res.clearCookie("token");
        res.status(200).json({"message":"User Logout successfully"});
}




module.exports={registerUser,loginUser,logoutUser};