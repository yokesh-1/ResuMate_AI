import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
    {
    name: {string , required :true},
    email: {string , required :true ,unique:true},
    password: {string , required :true},
},
{
    timestamps:true
}
)

UserSchema.methods.comparePassword = function (password) {
     return bcrypt.compareSync(password, this.password)
}

const User =mongoose.model("User" , UserSchema)

export default User ;
