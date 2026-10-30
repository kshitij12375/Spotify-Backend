const express=require('express');
const cookieParser=require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');
const cors=require('cors');
const path=require('path');

const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

const __dirname = path.resolve();




 

app.use("/api/auth",authRoutes);
app.use("/api/music",musicRoutes);

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
    app.get("/{*splat}",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
    })
    
   
}



module.exports=app;