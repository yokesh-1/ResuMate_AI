import mongoose from "mongoose";


const connectDB = async() => {
    try{
        mongoose.connection.on("connected" , () =>{console.log("Db connected succesfully")})
        let mongoDbURI = process.env.MONGODB_URI;
        const projectName = 'resume-builder';
        if (!mongoDbURI) {
            throw new Error ("MONGODB_URI env not set ")
        }

        if (mongoDbURI.endsWith('/') ) {
            mongoDbURI = mongoDbURI.slice(0,-1)
        }
        await mongoose.connect(`${mongoDbURI}/${projectName}`)
    }

    catch (error){
        console.log("Error Connecting to MongoDB:" ,error)

    }
}

export default connectDB ;