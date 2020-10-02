const mongoose = require('mongoose');
const ComercianteSchema = new mongoose.Schema({
    nome: String,
    apelido: String,
    data_nascimento:  Date,
    contacto: Number,
    bairro: String,
    rua: String,
    bi: String,
    genero:String,
    estado:Number,
    casa_nr:String,
    pagamentos: [
        {
            
            estado: String,
            data_pagamento: { type: Date, default: Date.now },
            data_expiracao:Date,
            notificado:String,
            total:Number,



        }

    ],
    local: {
        codigo: String,
        tipo: String
    }



})
const Comerciante = mongoose.model('Comerciante', ComercianteSchema);
module.exports = {Comerciante};