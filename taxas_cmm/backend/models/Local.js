const mongoose=require('mongoose');
const LocalSchema=new mongoose.Schema({
    codigo:String,
    tipo:String,
    estado:Number,
    vaga:String
}) ;
const Local=mongoose.model('Local',LocalSchema);
module.exports={Local};