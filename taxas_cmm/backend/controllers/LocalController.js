const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var { Local } = require('../models/Local');
var { Comerciante } = require('../models/Comerciante');


// => localhost:3000/Locals/

function updateLocalComerciante(id, codigo, tipo) {

    Comerciante.updateOne({ 'local.codigo': id }, {
        $set: {
            local: {
                codigo: codigo, tipo: tipo
            }
        }
    }, { new: true }, (err, doc) => {
        if (!err) { console.log("Updated Comerciante ") }
        else { console.log('Error in Comerciante Update :' + JSON.stringify(err, undefined, 2)); }
    });

}


router.get('/', (req, res) => {
    var estado = { estado: 1 }
    Local.find(estado,(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Locais :' + JSON.stringify(err, undefined, 2)); }
    });
});
router.get('/livre', (req, res) => {
  
    var vaga = {
        vaga: 'livre',
        estado: 1
    };

    Local.find(vaga,(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Locais :' + JSON.stringify(err, undefined, 2)); }
    });
});
router.get('/:id', (req, res) => {
    Local.findById(req.params.id, (err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Locais :' + JSON.stringify(err, undefined, 2)); }
    });
});



router.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Local.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Local :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.post('/', (req, res) => {

    var loc = new Local({
        codigo: req.body.codigo,
        tipo: req.body.tipo,
        estado: 1,
        vaga: "livre"
    });

    loc.save((err, doc) => {

        if (!err) {
            // updateLocalComerciante(req.params.id, req.body.codigo, req.body.tipo);




            res.send(doc);
        }
        else { console.log('Error in Local Save :' + JSON.stringify(err, undefined, 2)); }
    });



});

router.patch('/:id', (req, res) => {


    var code = { codigo: req.params.id }

    Local.updateOne(code, { $set: req.body }, { new: true }, (err, doc) => {
        if (!err) {
        

            updateLocalComerciante(req.params.id, req.body.codigo, req.body.tipo);





            res.send(doc);
        }
        else { console.log('Error in Local Update :' + JSON.stringify(err, undefined, 2)); }
    });
});
router.patch('/:id/remove', (req, res) => {

    


        var code = { codigo: req.params.id }
    Local.updateOne(code, { $set: { estado: 0 } }, { new: true }, (err, doc) => {
        if (!err) {

            updateLocalComerciante(req.params.id, '', '');


            res.send(doc);
        }
        else { console.log('Error in Local Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});


module.exports = router;