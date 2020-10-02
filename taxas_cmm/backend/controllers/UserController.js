const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
require("dotenv-safe").config();
var jwt = require('jsonwebtoken');

var { User } = require('../models/User');

// => Userhost:3000/Users/


//authentication
router.post('/login', (req, res, next) => {
    User.findOne({ username: req.body.username, senha: req.body.senha }, (err, docs) => {
        if (docs) {
         if(docs.estado==1){
            let token = jwt.sign({ username: docs.nivel }, 'secret', { expiresIn: '3h' });
            return res.status(200).json(docs.nivel);
         }else{
            return res.status(501).json({ message: ' Invalid Credentials' });
         }

           
        } else {
            return res.status(501).json({ message: ' Invalid Credentials' });
        }
    })
    //esse teste abaixo deve ser feito no seu banco de dados

})
router.get('/', (req, res) => {
    var estado = { estado: 1 }
    User.find(estado,(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Users :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    User.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving User :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.post('/', (req, res) => {
    var us = new User({
        username: req.body.username,
        senha: req.body.senha,
        nivel: req.body.nivel,
        estado: 1
    });
    us.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in User Save :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);
    
    User.findByIdAndUpdate(req.params.id, {
        $set: {
            username: req.body.username,
            senha: req.body.senha,
            nivel: req.body.nivel
        }
    }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in User Update :' + JSON.stringify(err, undefined, 2)); }
    });
});
router.put('/:id/remove', (req, res) => {

    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var us = new User({ estado: 0 });

    User.findByIdAndUpdate(req.params.id, { $set: { estado: 0 } }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in User Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});


module.exports = router;