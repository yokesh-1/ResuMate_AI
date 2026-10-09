import User from '../models/User';
import bcrypt from 'bcrypt' ;
import jwt from 'jsonwebtoken' ;


const generateToken = (userId) =>{
    const token =jwt.sign({userId} , process.env.JWT_SECRET ,{expiresIn:'7d'})
    return  token
}

//Controller for user Registration 
// POST METHOD : /api/users/register
export const registeruser = async (req,res) =>{
    try{
        const{name, email, password} =req.body;

        //Check  if required fileds are present 
        if(!name || !email || !password) {
            return res.status(400).json({message :'missing required fields'})
        }

       //Check  if user already exists
       const user = await User.findOne({email})
       if (user) {
           return res.status(400).json({message :'user already exists'})
       }

       // Create new User
       const hashedPassword = await bcrypt.hash(password,10)
       const newuser = await User.create({
        name , email , password :hashedPassword
       })

       //return success message
       const token =generateToken(newUser._id);
       newUser.password = undefined;
       return res.status(201).json({message :'user created succesfully', token , user :newuser})


    }
    catch(error){
         return res.status(400).json({message: error.message})
    }

}


//Controller for user Login
// POST METHOD : /api/users/login
export const loginuser = async (req,res) =>{
    try{
        const{email, password} =req.body;

       //Check  if user  exists
       const user = await User.findOne({email})
       if ( !user) {
           return res.status(400).json({message :'Invalid email or password'})
       }

       // check and verify password 
       if(!user.comparePasword(password)){
        return res.status(400).json({message :'Invalid password'}) 
       }

       //return success message
            const token =generateToken(user._id);
       user.password = undefined;
       return res.status(200).json({message :'Login succesful', token , user})


    }
    catch(error){
         return res.status(400).json({message: error.message})
    }

}

//Controller for getting user  by id 
// GET METHOD : /api/users/data
export const getUserById = async (req,res) =>{
    try{
        const userId =req.userId;

    //check if user exits
    const user = await User.findById(userId)
    if(!userId) {
        return res.status(404).json({message: 'user not found'})
    }

    // return user 
    user.password = undefined;
    return res.status(200).json({message :user})

    }
    catch(error){
         return res.status(400).json({message: error.message})
    }

}