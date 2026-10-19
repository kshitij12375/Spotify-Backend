const mongoose=require('mongoose');

async function connectDB(){
    try {

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected Successfully");
        
    } catch (error) {
        console.error("Error: Database not connected ",err);
    }
}


module.exports=connectDB;