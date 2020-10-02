const mongoose=require('mongoose');
const UserSchema=new mongoose.Schema({
    username:String,
    senha:String,
    nivel:String,
    estado:Number
}) ;
const User=mongoose.model('User',UserSchema);
module.exports={User};