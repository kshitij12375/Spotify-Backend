const musicModel = require("../models/music.model");
const userModel = require("../models/user.model");
const jwt=require('jsonwebtoken');
const { uploadFile } = require("../services/storage.service");
const albumModel = require("../models/album.model");





async function createMusic(req,res){

   

        const {title}=req.body;
        const file=req.file;
        const result=await uploadFile(file.buffer.toString("base64"))

        const music=await musicModel.create({
            uri:result.url,
            title,
            artist:req.user.id
        })

        res.status(201).json({
            "message":"Music created succesfully",
            music:{
                id:music._id,
                uri:music.uri,
                title:music.title,
                artist:music.artist,

            }
        })
        
   



}

async function createAlbum(req,res){

    
        const {title,musics}=req.body;

        const album =await albumModel.create({
            title,
            artist:req.user.id,
            musics:musics
        })

        res.status(201).json({"message":"Album create",
            album,
            id:album._id
        })
        
    




}

async function getAllMusic(req,res){
    const musics=await musicModel.find().populate("artist");

    res.status(201).json({
        "message":"Fetched Music successfully",
        musics
    })
}


async function getAllAlbums(req,res){
    const albums=await albumModel.find().populate("artist").populate("musics");

    res.status(201).json({
        "message":"Fetched Music successfully",
        albums
    })
}



module.exports={createMusic,createAlbum,getAllMusic,getAllAlbums};