const jwt=require('jsonwebtoken');



async function authArtist(req,res,next){
    const token=req.cookies.token;
    
        if(!token){
            return res.status(401).json({
                "Message":"unauthorised"
            })
        }
    
        try {
            const decoded=jwt.verify(token,process.env.SECRET_KEY);
    
            if(decoded.role !== 'artist'){
                return res.status(401).json({"message":"Forbidden error"})
            }
            req.user=decoded;
            next();
            
        } catch (error) {
    
            console.log(error);
    
            return res.status(401).json({"message":"Unauthorized"})
            
        }
    

}


async function authUser(req,res,next){
    const token=req.cookies.token;
    
        if(!token){
            return res.status(401).json({
                "Message":"unauthorised"
            })
        }
    
        try {
            const decoded=jwt.verify(token,process.env.SECRET_KEY);

            if(decoded.role!="user" && decoded.role!="artist"){
                return res.status(403),json({"message":"You dont have access"});
            }
    
            req.user=decoded;
            next();
            
        } catch (error) {
    
            console.log(error);
    
            return res.status(401).json({"message":"Unauthorized"})
            
        }
    

}



module.exports={authArtist,authUser};