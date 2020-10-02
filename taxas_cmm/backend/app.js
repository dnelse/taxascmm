
//EVU4q4BX2g@

const express = require('express');
const app = express();
const mongoose = require('./database/mongoose');
var code = '';
var state = '';
var type = '';
var moment = require('moment');
const request = require('request');
const UssdMenu = require('ussd-menu-builder');
var comercianteController = require('./controllers/ComercianteController');
var localController = require('./controllers/LocalController')
var userController = require('./controllers/UserController');
const ComercianteFunctions = require('./controllers/ComercianteFuncions');
var payment;
var periodo = '';
var quantidade = 0;
const cors = require('cors');
var idPayment;
const { ObjectId } = require('mongodb');


var { Comerciante } = require('./models/Comerciante');


var factura = {};

function setState(setter) {
    state = setter;
}


const menu = new UssdMenu();
var codigo;

const bodyParser = require('body-parser');
const { set } = require('mongoose');
app.use(express.json());
const router = express.Router();

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:4200' }));

app.use(bodyParser.urlencoded({ extended: false }));


//var myVar = setInterval(myTimer, 10000);
var sendmsg=setInterval(ComercianteFunctions.mensagem,86400000)
function setQuantity(value) {
    quantidade = value;
}
//86400000

function setVariable(codigo, tipo) {
    code = codigo;
    type = tipo;
}
function facturarNull() {

    var unitVal = (type == "Barraca") ? 700 : 20;
    var exp = (type == "Barraca") ? 30 : 1;
    let today = new Date();

    var payDay = new Date().toISOString().slice(0, 10);
    today.setDate(today.getDate() + quantidade * exp);
    var expDay = today.toISOString().slice(0, 10);
    factura = {
        multa: 0,
        data_pagamento: payDay,
        data_expiracao: expDay,
        total: unitVal * quantidade
    };




}
function facturar(days, compDays, dataExp) {
    if (days < compDays) {

        var unitVal = (type == "Barraca") ? 700 : 20;
        let today = new Date();
        var payDay = new Date().toISOString().slice(0, 10);
        var exp = (type == "Barraca") ? 30 : 1;
        var exceeded;
        //Math.floor(compDays / exp);
        var div = compDays / exp;
        if (div > 1 && div <= 1.999999) {
            exceeded = 2;
        }
        else {
            exceeded = Math.floor(div);
        }

        today.setDate(today.getDate() + quantidade * exp)
        var expDay = today.toISOString().slice(0, 10);

        factura = {
            multa: unitVal * exceeded,
            data_pagamento: payDay,
            data_expiracao: expDay,
            total: unitVal * exceeded + unitVal * quantidade
        };
    }
    else {
        var unitVal = (type == "Barraca") ? 700 : 20;
        var exp = (type == "Barraca") ? 30 : 1;

        var payDay = new Date().toISOString().slice(0, 10);

        dataExp.setDate(dataExp.getDate() + quantidade);
        var expDay = dataExp.toISOString().slice(0, 10);
        factura = {
            multa: 0,
            data_pagamento: payDay,
            data_expiracao: expDay,
            total: unitVal * quantidade
        };
    }
}

// Define menu states
menu.startState({
    run: function () {
        // use menu.con() to send response without terminating session      
        menu.con('M-Pesa' +
            '\n1. Transferir Dinheiro' +
            '\n2. Levantar Dinheiro' +
            '\n3. Comprar Credito' +
            '\n4. Jackpot e Internet' +
            '\n5.CREDELEC' +
            '\n6.Pagamentos' +
            '\n7.Xitique M-Pesa' +
            '\n8.Minha Conta');
    },
    // next object links to next state based on user input
    next: {
        '1': 'Transferir Dinheiro',
        '2': 'Levantar Dinheiro',
        '3': 'Comprar Credito',
        '4': 'Jackpot e Internet',
        '5': 'CREDELEC',
        '6': 'Pagamentos',
        '7': 'Xitique M-Pesa',
        '8': 'Minha Conta',

    }
});

menu.state('Transferir Dinheiro', {
    run: function () {
        // fetch balance

        // use menu.end() to send response and terminate session
        menu.end('Sucess');

    }
});

menu.state('Levantar Dinheiro', {
    run: function () {
        // menu.con('Enter amount:');
        menu.end('Sucess');
    }
});
menu.state('Comprar Credito', {
    run: function () {
        // menu.con('Enter amount:');
        menu.end('Sucess');
    }
});
menu.state('Jackpot e Internet', {
    run: function () {
        // menu.con('Enter amount:');
        menu.end('Sucess');
    }
});
menu.state('CREDELEC', {
    run: function () {
        // menu.con('Enter amount:');
        menu.end('Sucess');
    }
});
menu.state('Pagamentos', {
    run: function () {
        // menu.con('Enter amount:');
        menu.con('' +
            '\n1. Comerciante Paga Facil' +
            '\n2. POS' +
            '\n3. Agua' +
            '\n4. TV' +
            '\n5.Servicos Universitarios' +
            '\n6.Vodacom Pos-Pago/Hibrido' +
            '\n7.Digitar o codigo do servico' +
            '\n8.Procurar na Lista' +
            '\n9.Taxas de mercados municipais');
    },
    next: {
        '1': 'Comerciante Paga Facil',
        '2': 'POS',
        '3': 'Agua',
        '4': 'TV',
        '5': 'Servicos Universitarios',
        '6': 'Vodacom Pos-Pago/Hibrido',
        '7': 'Digitar o codigo do servico',
        '8': 'Procurar na Lista',
        '9': 'Taxas de comercio precario'

    }


});
menu.state('Xitique M-Pesa', {
    run: function () {
        // menu.con('Enter amount:');
        menu.end('Sucess');
    }
});
menu.state('Minha Conta', {
    run: function () {
        // menu.con('Enter amount:');
        menu.end('Sucess');
    }
});
/// Rotas submenu
menu.state('Comerciante Paga Facil', {
    run: function () {
        // menu.con('Enter amount:');
        menu.end(' Sucess on Comerciante Paga Facil');
    }
});
menu.state('POS', {
    run: function () {
        // menu.con('Enter amount:');
        menu.end('Sucess on POS');
    }
});
menu.state('Agua', {
    run: function () {
        // menu.con('Enter amount:');
        menu.end('Sucess on Agua');
    }
});
menu.state('TV', {
    run: function () {
        // menu.con('Enter amount:');
        menu.end('Sucess on TV');
    }
});
menu.state('Servicos universitarios', {
    run: function () {
        // menu.con('Enter amount:');
        menu.end('Sucess on Servicos universitario');
    }
});
menu.state('Vodacom Pos-Pago/Hibrido', {
    run: function () {
        // menu.con('Enter amount:');
        menu.end('Sucess on Vodacom Pos-Pago/Hibrido');
    }
});
menu.state('Digitar o codigo do servico', {
    run: function () {
        // menu.con('Enter amount:');
        menu.end('Sucess on Digitar o codigo do servic');
    }
});


menu.state('Paga facil online', {
    run: function () {
        // menu.con('Enter amount:');
        menu.end('Sucess on Paga facil online');
    }
});

menu.state('Taxas de comercio precario', {


    run: function () {
        menu.con('Digite o Codigo do Local:');






    },
    next: {



        '*[a-zA-Z]+': function (callback) {
            var codeTyped = menu.val;


            ComercianteFunctions.getLocal(codeTyped).then(data => {

                if (data == undefined || data == null) {
                    menu.end(' Numero do local incorrecto');

                } else {
                    setVariable(data.local.codigo, data.local.tipo);


                    var tipo = data.local.tipo;

                    if (tipo == "Barraca") {

                        callback('barraca');




                    }
                    else {

                        //state='banca'
                        callback('banca')





                    }
                }

            })



        }

    }


});




menu.state('Taxas de comercio precario.codigo', {


    run: function () {

        var codeTyped = menu.val;
        ComercianteFunctions.getLocal(codeTyped).then(data => {







            if (data == undefined || data == null) {
                menu.end(' Numero do local incorrecto');

            } else {
                setVariable(data.local.codigo, data.local.tipo);


                var tipo = data.local.tipo;

                if (tipo == "Barraca") {
                    menu.con('Digite o pin');


                }
                else {
                    menu.con('1.entrar em periodo de pagamento');




                }
            }

        })


        //menu.end('O codigo do local e:  ' + codigo);

    },
    next: {
        '1': function () {



            if (type == "Barraca") {
                return 'Taxas de comercio precario.faturar';
            } else {
                return 'local';
            }

        }
    }
});
menu.state('Taxas de comercio precario.faturar', {
    run: function () {


        ComercianteFunctions.getPagamento(code).then(data => {

            if (data.pagamentos.toString() == '' || data.pagamentos.toString() == '') {



                facturarNull();
                menu.con('Efectuar o pagamento da taxa no valor de ' + factura.total + ' MT  ' + ' Na ' + type + ' ' + code + '  para o CONSELHO MUNICIPAL DE MAPUTO? Digita 1 para Confirmar ou 2 para Cancelar  ' +
                    '\n1. Confirmar' +
                    '\n2. Cancelar');
            }
            else {
                idPayment = data.pagamentos[0]._id;


                var dataExp = new Date(moment(data.pagamentos[0].data_expiracao).format('YYYY-MM-DD'));
                var dataPayment = new Date(moment(data.pagamentos[0].data_pagamento).format('YYYY-MM-DD'));

                var diffTime = dataExp.getTime() - dataPayment.getTime();

                var strDate = new Date().toISOString();
                var currDate = new Date(moment(strDate).format('YYYY-MM-DD'));

                var days = diffTime / (1000 * 3600 * 24);

                var compDays = Math.abs((currDate.getTime() - dataExp.getTime()) / (1000 * 3600 * 24));


                facturar(days, compDays, dataExp);
                menu.con('Efectuar o pagamento da taxa no valor de ' + factura.total + ' MT ' + '  para o CONSELHO MUNICIPAL DE MAPUTO? Digita 1 para Confirmar ou 2 para Cancelar  ' +
                    '\n1. Confirmar' +
                    '\n2. Cancelar');




                //////////////////////////
            }







        })




    },
    next: {
        '1': 'Confirmar',
        '2': 'Cancelar',


    }
});
menu.state('Confirmar', {
    run: function () {





        let url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        let auth = new Buffer.from("KawQd7AQhtzE3HcOhsiYDtZsRGIZHBRl:kNsqqxiUsh5pEhs7").toString('base64');

        request(
            {
                url: url,
                headers: {
                    "Authorization": "Basic " + auth
                }
            },
            (error, response, body) => {
                if (error) {
                    console.log(error)
                }
                else {



                    const url = 'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest',
                        auth = 'Bearer ' + JSON.parse(body).access_token;


                    request({
                        method: "POST",
                        url: url,
                        headers: {
                            "Authorization": auth
                        },
                        json: {
                            "InitiatorName": "Initiator Name(Shortcode 1)",
                            "SecurityCredential": "WnMJ5iscthwABKL3xUNFwEnIV9UGJDLOuYWOQI8IO42Qhpf3/jnjcUbnI4oNQ88aTX5srscJu1DgJqFyezyYfy5VYhXGxdtPbnsBgy6nwyHjvwaZXZpDgRcxrWwiNH/ASXZsGorqAV7pKGqtAQ32fY558pA5an0hTHv6S5dNNb3cZNGr07rTWFvI+9GBvxWc9jQYUCy3ZGV5pJ40yLoXRFHTvdcdkXkOkle7WmVUTYEmvuPxS9VUBgTJZKFWq82dnxD/08lFHDbJT4WG4PecmLgkEsQEZU/iFE4AbGFhv4p9HxWfeS2Rvas6lZD5oRkIODWmb5sKhfu/zOIRcbSu6g==",
                            "CommandID": "BusinessPayment",
                            "Amount": factura.total,
                            "PartyA": "601342",
                            "PartyB": "254708374149",
                            "Remarks": "please pay",
                            "QueueTimeOutURL": "http://192.168.1.4/b2c_timeout_url",
                            "ResultURL": "http://192.168.1.4/b2c_result_url",
                            "Occasion": "endmonth"
                        }
                    },
                        function (error, response, body) {
                            if (error) {
                                console.log(error)

                            }
                            else {
                                // errorCode
                                if (body.errorCode == undefined || body.errorCode == null) {


                                    Comerciante.updateOne(
                                        { 'local.codigo': code },
                                        {
                                            $push: {
                                                pagamentos: {
                                                    'data_pagamento': factura.data_pagamento,

                                                    'data_expiracao': factura.data_expiracao,
                                                    'total': factura.total,
                                                    
                                                }
                                            }
                                        }
                                    ).then(function (resp) {
                                        ComercianteFunctions.sendMessage(code, factura.total, factura.multa, new Date().toLocaleString(),type);

                                        menu.end("Confirmado " + body.ConversationID + "  Pagaste " + factura.total + " MT  referente a taxa de mercados municipais ao Conselho Municipal de Maputo aos " + new Date().toLocaleString());




                                    }).catch(function (err) {

                                    })




                                }
                                else {
                                    menu.end("Falhou a transaccao")








                                }

                            }
                        }
                    )






                    // let resp = 
                    // return JSON.parse(body).access_token

                }
            }
        )









    },
});
menu.state('barraca', {
    run: function () {
        menu.con("Digite a quantidade de meses que pretende pagar");



    },
    next: {



        '*\\d+': function (callback) {


            setQuantity(menu.val);
            callback('pin');

        }
    }
});
menu.state('banca', {
    run: function () {
        menu.con("Digite a quantidade de dias que pretende pagar");
    },
    next: {



        '*\\d+': function (callback) {

            setQuantity(menu.val);
            callback('pin')

        }
    }
});
menu.state('local', {
    run: function () {
        menu.con('Seleccione o periodo de taxa' +
            '\n1. Diaria' +
            '\n2. Semanal' +
            '\n3. Mensal'
        );
    },
    next: {
        '1': 'Diaria',
        '2': 'Semanal',
        '3': 'Mensal',



    }
});


// nesting states


// Registering USSD handler with Express
menu.state('pin', {
    run: function () {

        menu.con("Digite o pin");

    }, next: {
        '*\\d+': 'Taxas de comercio precario.faturar',



    }
});
menu.state('Semanal', {
    run: function () {
        menu.con("Digite o pin");
        periodo = 'Semanal';

    }, next: {
        '1': 'Taxas de comercio precario.faturar',



    }
});
menu.state('Mensal', {
    run: function () {
        menu.con("Digite o pin");
        periodo = 'Mensal';

    }, next: {
        '1': 'Taxas de comercio precario.faturar',



    }
});


app.post('/ussdHubtel', function (req, res) {
    menu.run(req.body, ussdResult => {
        res.send(ussdResult);
    });
});
app.use('/comerciantes', comercianteController);
app.use('/locais', localController);
app.use('/users', userController);


router.post('/b2c_result_url', (req, res) => {
    console.log("-------------------- B2C Result -----------------")
    console.log(JSON.stringify(req.body.Result))
})

router.post('/b2c_timeout_url', (req, res) => {
    console.log("-------------------- B2C Timeout -----------------")
    console.log(req.body)
})


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "GET,POST,HEAD,PUT,PATCH,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});




app.listen(3000, () => console.log("Server Conected on port 3000"));
