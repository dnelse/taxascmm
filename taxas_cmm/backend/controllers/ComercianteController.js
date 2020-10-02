const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var moment = require('moment');
const accountsid = 'AC0ad51a581c6b92010fb07dd2ab33ea68'
const authToken = 'd9fc9e524fd075d9e73fda73dbf71be9'
const client = require('twilio')(accountsid, authToken);
const ComercianteFunctions = require('./ComercianteFuncions');
//EVU4qRBX2gdeny1998trindade3
//(205) 727-8454
//+12057278454

var { Comerciante } = require('../models/Comerciante');
var { Local } = require('../models/Local');

const shortCode = '17450'
const username = 'sandbox'
const apikey = '9c8f77fa99f28a2fa8ea614dd37ccea704edc2b0f5f68e9218922c6cf02e6617'
const options = { 
    apiKey: apikey,
    username: username
}
const AfricasTalking = require('africastalking')(options)
const sms = AfricasTalking.SMS
const MessagingResponse = require('twilio').twiml.MessagingResponse;

// => localhost:3000/Comerciantes/


function facturar(days, compDays, tipo,factura, nome, code, dataExp) {

    if (days < compDays) {

        var total = (tipo == "Barraca") ? 700 : 20;
        let today = new Date();
        var payDay = today.toISOString().slice(0, 10);
        var exp = (tipo == "Barraca") ? 30 : 1;
        var exceeded;
        //Math.floor(compDays / exp);
        var div = compDays / exp;
        if (div > 1 && div <= 1.999999) {
            exceeded = 2;
        }
        else {
            exceeded = Math.floor(div);
        }

        today.setDate(today.getDate() + exp)
        var expDay = today.toISOString().slice(0, 10);
        factura.push({
            nome: nome,
            codigo: code,
            tipo:tipo,
            data_pagamento: payDay,
            data_expiracao: expDay,
            multa:total * (exceeded-1),
            total: total * exceeded
        });
    }
    else {
        var total = (tipo == "Barraca") ? 700 : 20;
        var exp = (tipo == "Barraca") ? 30 : 1;
        // console.log("remain "+remainDays);
        //let sumDays = remainDays + exp;
        //console.log("Soma"+sumDays);
        let today = new Date();
        var payDay = today.toISOString().slice(0, 10);

        dataExp.setDate(dataExp.getDate() + 1);
        var expDay = dataExp.toISOString().slice(0, 10);
        factura.push({
            nome: nome,
            codigo: code,
            tipo:tipo,
            multa:0,
            data_pagamento: payDay,
            data_expiracao: expDay,
            total: total
        });
    }
}

function days(date2, date1) {
    var form_date2 = new Date(moment(date2).format('YYYY-MM-DD'))
    var form_date1 = new Date(moment(date1).format('YYYY-MM-DD'))
    var diffTime = form_date2.getTime() - form_date1.getTime();
    var days = diffTime / (1000 * 3600 * 24);

    return (days == 0) ? days+1 : days;
}



router.get('/pagamentos', (req, res) => {
    var controlo = new Array
    Comerciante.find({




    }).select({ 'pagamentos': { '$slice': -1 } }).then(data => {

        var teste = data[0].pagamentos[0];
        var tamanho = data.length;

        var payDay = new Date(data[0].pagamentos[0].data_pagamento);
        var formdate = payDay.toJSON().slice(0, 10);
        

        var expDay = data[0].pagamentos.data_expiracao

        for (var i = 0; i < tamanho; i++) {

            if (data[i].pagamentos.length > 0) {
                var deadline = days(data[i].pagamentos[0].data_expiracao, data[i].pagamentos[0].data_pagamento);

                var currdate = new Date();
                var formdate = currdate.toJSON().slice(0, 10);
                var compDays = days(currdate, data[i].pagamentos[0].data_expiracao)

                if (compDays > deadline) {
                    controlo.push({
                        nome: data[i].nome,
                        apelido: data[i].apelido,
                        local: data[i].local.codigo,
                        ultimo_pagamento: formdate,
                        situacao: "Dívida"
                    });


                } else {
                    controlo.push({
                        nome: data[i].nome,
                        apelido: data[i].apelido,
                        local: data[i].local.codigo,
                        ultimo_pagamento: formdate,
                        situacao: "Sem dívida"
                    });

                }
            }

        }

        res.send(controlo);
    })
});
router.get('/dividas', (req, res) => {
    Comerciante.find({




    }).select({ 'pagamentos': { '$slice': -1 } }).then(data => {

        var teste = data[0].pagamentos[0];
        var tamanho = data.length;

        var payDay = new Date(data[0].pagamentos[0].data_pagamento);
        var formdate = payDay.toJSON().slice(0, 10);
        var controlo = new Array



        for (var i = 0; i < tamanho; i++) {
   
            if (data[i].pagamentos.length > 0) {
               
                var deadline = days(data[i].pagamentos[0].data_expiracao, data[i].pagamentos[0].data_pagamento);

                var currdate = new Date();
                var formdate = currdate.toJSON().slice(0, 10);
                var compDays = days(currdate, data[i].pagamentos[0].data_expiracao)
                var expDate = new Date(data[i].pagamentos[0].data_expiracao)


                if (compDays > deadline ) {
                 
                    controlo.push({

                        local: data[i].local.codigo,
                        data_expiracao: new Date(data[i].pagamentos[0].data_expiracao).toJSON().slice(0, 10),
                        dias_atraso: compDays
                    });


                }
            }

        }

        res.send(controlo);
    })
});






router.get('/dashboard', (req, res) => {

    Comerciante.find((err, docs) => {
        if (!err) {
            var dashboard = {}
            var num_pagamento = 0;
            var dividas = 0;
            var total = 0;
            for (var i = 0; i < docs.length; i++) {
                
                    var data_pagamento = new Date(docs[i].pagamentos[docs[i].pagamentos.length-1].data_pagamento).toJSON().slice(0, 10)
                    var data_expiracao = new Date(docs[i].pagamentos[docs[i].pagamentos.length-1].data_expiracao).toJSON().slice(0, 10)
                    var curDate = new Date().toJSON().slice(0, 10);

                    
                        var deadline = days(data_expiracao, data_pagamento);

                        var currdate = new Date();

                        var compDays = days(currdate, data_expiracao);
                        if (compDays > deadline) {
                            dividas++
                        }
                    

                    if (data_pagamento == curDate) {

                        num_pagamento++;
                        total += docs[i].pagamentos[docs[i].pagamentos.length-1].total;




                    }
                
            }
            dashboard = {
                num_pagamento: num_pagamento,
                dividas: dividas,
                total: total
            }


            res.send(dashboard);

        }
        else { console.log('Error in Retriving Comerciantes :' + JSON.stringify(err, undefined, 2)); }
    });
});
router.get('/relatorio', (req, res) => {

    Comerciante.find((err, docs) => {
        if (!err) {
            var dashboard = {}
            var num_pagamento = 0;
            var dividas = 0;
            var total = 0;
            for (var i = 0; i < docs.length; i++) {
                if (docs[i].pagamentos.length > 0) {
                    var size = docs[i].pagamentos.length;

                    var deadline = days(docs[i].pagamentos[size - 1].data_expiracao, docs[i].pagamentos[size - 1].data_pagamento);

                    var currdate = new Date();

                    var compDays = days(currdate, docs[i].pagamentos[size - 1].data_expiracao)
                    if (compDays > deadline) {
                        dividas++
                    }

                    for (var j = 0; j < docs[i].pagamentos.length; j++) {
                        var data_pagamento = new Date(docs[i].pagamentos[j].data_pagamento).toJSON().slice(0, 10)
                        var curDate = new Date().toJSON().slice(0, 10);






                        num_pagamento++;

                        if (docs[i].pagamentos[j].total != undefined) {

                            total += docs[i].pagamentos[j].total;
                        }






                    }
                }
            }
            dashboard = {
                num_pagamento: num_pagamento,
                dividas: dividas,
                total: total
            }


            res.send(dashboard);

        }
        else { console.log('Error in Retriving Comerciantes :' + JSON.stringify(err, undefined, 2)); }
    });
});


router.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();

    console.log(req.body)
    // twiml.message('Caro vendedor o seu ultimo pagamento foi em 2/07/2020');
    client.messages.create({
        to: '+258847711160',
        from: '+12057278454',
        body: 'O código do seu local é ' + req.body.Body

    }).then((message) => {
        console.log(message.sid);
    })

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());

});


router.get('/extracto', (req, res) => {


    console.log('eitaaa');
    var opts = {
        from: shortCode,
        to: '+258847711160',
        message: 'Pronto pra tudo!'
    }
    sms.send(opts).then(
        console.log('Message sent successfully')
    ).catch(
        console.log('Something went wrong with message sending')
    )


})


router.get('/:id/graficoPagamentos', (req, res) => {
    Comerciante.find((err, docs) => {
        if (!err) {

            var meses = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (var i = 0; i < docs.length; i++) {
                for (var j = 0; j < docs[i].pagamentos.length; j++) {
                    var data_pagamento = new Date(docs[i].pagamentos[j].data_pagamento);
                    //var curDate = new Date().toJSON().slice(0, 10);

                    if (data_pagamento.getFullYear().toString() == req.params.id) {

                        meses[data_pagamento.getMonth()] = meses[data_pagamento.getMonth()] + 1;
                    }


                }
            }



            res.send(meses);

        }
        else { console.log('Error in Retriving Comerciantes :' + JSON.stringify(err, undefined, 2)); }
    });
})


router.get('/:id/graficoAcumulado', (req, res) => {
    Comerciante.find((err, docs) => {
        if (!err) {

            var meses = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (var i = 0; i < docs.length; i++) {
                for (var j = 0; j < docs[i].pagamentos.length; j++) {
                    var data_pagamento = new Date(docs[i].pagamentos[j].data_pagamento);
                    var total = docs[i].pagamentos[j].total;
                    //var curDate = new Date().toJSON().slice(0, 10);

                    if (data_pagamento.getFullYear().toString() == req.params.id) {

                        meses[data_pagamento.getMonth()] = meses[data_pagamento.getMonth()] + total;
                    }


                }
            }



            res.send(meses);

        }
        else { console.log('Error in Retriving Comerciantes :' + JSON.stringify(err, undefined, 2)); }
    });
})
router.get('/anos', (req, res) => {
    Comerciante.find((err, docs) => {
        if (!err) {

            var anos = new Array
            for (var i = 0; i < docs.length; i++) {
                for (var j = 0; j < docs[i].pagamentos.length; j++) {
                    var data_pagamento = new Date(docs[i].pagamentos[j].data_pagamento);

                    var index = anos.findIndex(obj => obj.ano == data_pagamento.getFullYear());
                    if (index < 0) {
                        anos.push({
                            ano: data_pagamento.getFullYear()
                        })
                    }

                }
            }



            res.send(anos);

        }
        else { console.log('Error in Retriving Comerciantes :' + JSON.stringify(err, undefined, 2)); }
    });
})

router.get('/', (req, res) => {
    var estado = { estado: 1 }
    Comerciante.find(estado, (err, docs) => {
        var comerciante = new Array
        if (!err) {
            for (var i = 0; i < docs.length; i++) {
                comerciante.push(
                    {
                        _id: docs[i]._id,
                        nome: docs[i].nome,
                        apelido: docs[i].apelido,
                        codigo: docs[i].local.codigo,
                        bairro: docs[i].bairro,
                        contacto: docs[i].contacto



                    }
                )


            }


            res.send(comerciante);
        }




        else { console.log('Error in Retriving Comerciantes :' + JSON.stringify(err, undefined, 2)); }
    });



})









router.put('/pagamento', (req, res) => {
 

    Comerciante.updateOne(
        { 'local.codigo': req.body.codigo },
        {
            $push: {
                pagamentos: {
                    'data_pagamento': req.body.data_pagamento,
                    'data_expiracao': req.body.data_expiracao,
                    'total': req.body.total,
                    
                    
                }
            }
        }
    ).then(function (resp) {
        res.send(resp);


        ComercianteFunctions.sendMessage(req.body.codigo, req.body.total, req.body.multa, new Date().toLocaleString(),req.body.tipo,);

        console.log(resp)
    })
})

router.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);
    var id = req.params.id;



    Comerciante.findById(req.params.id, (err, doc) => {
        if (!err) {


            res.send(doc);
        }

        else { console.log('Error in Retriving Comerciante :' + JSON.stringify(err, undefined, 2)); }
    });
});
router.get('/:id/factura', (req, res) => {


    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);
    var id = req.params.id;



    Comerciante.findById(req.params.id, (err, doc) => {
        var factura = new Array;
        if (!err) {

            var tipo = doc.local.tipo;
            var nome = doc.nome + ' ' + doc.apelido;
            var code = doc.local.codigo
            ComercianteFunctions.getPagamento(doc.local.codigo).then(data => {

                if (data.pagamentos.toString() == '' || data.pagamentos.toString() == '') {
                    var total = (tipo == "Barraca") ? 700 : 20;
                    let today = new Date();
                    var payDay = today.toISOString().slice(0, 10);
                    var exp = (tipo == "Barraca") ? 30 : 1;
                    today.setDate(today.getDate() + exp)
                    var expDay = today.toISOString().slice(0, 10);



                    factura.push({
                        data_pagamento: payDay,
                        nome: nome,
                        codigo: code,
                        tipo:tipo,
                        multa:0,
                        total: total,
                        data_expiracao: expDay
                    })
                    res.send(factura);

                }
                else {

                    var dataExp = new Date(moment(data.pagamentos[0].data_expiracao).format('YYYY-MM-DD'));
                    var dataPayment = new Date(moment(data.pagamentos[0].data_pagamento).format('YYYY-MM-DD'));

                    var diffTime = dataExp.getTime() - dataPayment.getTime();

                    var strDate = new Date().toISOString();
                    var currDate = new Date(moment(strDate).format('YYYY-MM-DD'));

                    var days = diffTime / (1000 * 3600 * 24);
                   
                    var compDays = Math.abs((currDate.getTime() - dataExp.getTime()) / (1000 * 3600 * 24));
                    facturar(days, compDays, tipo,factura, nome, code, dataExp);

                    res.send(factura);


                }

            })



        }

        else { console.log('Error in Retriving Comerciante :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.post('/', (req, res) => {



    Local.findOne(req.codigo, (err, docx) => {

        var cod = { codigo: req.body.codigo };

        var com = new Comerciante({
            nome: req.body.nome,
            apelido: req.body.apelido,
            data_nascimento: new Date(req.body.data_nascimento),
            contacto: req.body.contacto,
            genero: req.body.genero,
            bi: req.body.bi,
            bairro: req.body.bairro,
            rua: req.body.rua,
            casa_nr: req.body.casa_nr,
            estado: 1,
            local: {
                codigo: req.body.codigo,
                tipo: docx.tipo
            }
        });
        console.log(req.body);

        Local.updateOne(cod, { $set: { vaga: 'ocupado' } }, { new: true }, (err, docs) => {

        });
        com.save((err, doc) => {
            if (!err) {
                console.log("Gravado!!!!");

                res.send(doc);
            }
            else { console.log('Error in Comerciante Save :' + JSON.stringify(err, undefined, 2)); }
        });
    });
});

router.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Comerciante.findById(req.params.id, (err, doc) => {
        if (!err) {

            if (doc.local.codigo != req.body.codigo) {
                var codUp = { codigo: doc.local.codigo };

                Local.updateOne(codUp, { $set: { vaga: 'livre' } }, { new: true }, (err, docs) => {

                });

            }

            Comerciante.findByIdAndUpdate(req.params.id, {
                $set: {
                    nome: req.body.nome,
                    apelido: req.body.apelido,
                    data_nascimento: new Date(req.body.data_nascimento),
                    contacto: req.body.contacto,
                    genero: req.body.genero,
                    bi: req.body.bi,
                    bairro: req.body.bairro,
                    rua: req.body.rua,
                    casa_nr: req.body.casa_nr,

                    local: {
                        codigo: req.body.codigo,
                        tipo: req.body.tipo
                    }
                }
            }, { new: true }, (err, docx) => {
                if (!err) {
                    var codUpaft = { codigo: req.body.codigo };
                    Local.updateOne(codUpaft, { $set: { vaga: 'ocupado' } }, { new: true }, (err, docs) => {

                    });

                    res.send(docx);
                }
                else { console.log('Error in Comerciante Update :' + JSON.stringify(err, undefined, 2)); }
            });

        }

        else { console.log('Error in Retriving Comerciante :' + JSON.stringify(err, undefined, 2)); }
    });


});
router.put('/:id/remove', (req, res) => {

    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);


    Comerciante.findByIdAndUpdate(req.params.id, { $set: { estado: 0 } }, { new: true }, (err, doc) => {

        if (!err) {
            res.send(doc);

            Comerciante.findById(req.params.id, (err, doc) => {
                if (!err) {


                    const cod = { codigo: doc.local.codigo };
                    Local.updateOne(cod, { $set: { vaga: 'livre' } }, { new: true }, (err, docs) => {

                    });

                }


            });
        }
        else { console.log('Error in Comerciante Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});


module.exports = router;
