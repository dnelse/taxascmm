var { Comerciante } = require('../models/Comerciante');
const accountsid = 'AC0ad51a581c6b92010fb07dd2ab33ea68'
const authToken = 'd9fc9e524fd075d9e73fda73dbf71be9'
const client = require('twilio')(accountsid, authToken);

// => localhost:3000/Comerciantes/
const mensagem = function () {
    Comerciante.find({




    }).select({ 'pagamentos': { '$slice': -1 } }).then(data => {

   
        var tamanho = data.length;

        var payDay = new Date(data[0].pagamentos[0].data_pagamento);
   
   



        for (var i = 0; i < tamanho; i++) {

            if (data[i].pagamentos.length > 0) {


                var currdate = new Date().toJSON().slice(0, 10);


                var expDate = new Date(data[i].pagamentos[0].data_expiracao).toJSON().slice(0, 10)

               
                if (currdate == expDate) {

                    client.messages
                        .create({
                            body: ' Caro vendedor o prazo para o pagamento da taxa de mercados municipais expira hoje, para que  evite multas  por favor efectue o pagamento através do serviço M-Pesa ou indo a bilheteira do Mercado Central de Maputo.',
                            to: '+258847711160',
                            from: '+12057278454',
                        })
                        .then(message => console.log(message.sid));


                }
            }

        }


    })

}
const getLocal = function (id) {


    var comerciante = Comerciante.findOne({ 'local.codigo': id });


    return comerciante;

}
const getPagamento = function (id) {

    var comerciante = Comerciante.findOne({

        'local.codigo': id


    }).select({ 'pagamentos': { '$slice': -1 } })
    return comerciante;


}

const sendMessage = function (codigo, total, multa, data, tipo) {

    if (multa == 0) {
        client.messages
            .create({
                body: 'Realizou o pagamento de ' + total + ' MT referente a taxa de mercados municipais na ' + tipo + '  ' + codigo + ' ao Conselho Municipal aos ' + data,
                to: '+258847711160',
                from: '+12057278454',
            })
            .then(message => console.log(message.sid));
    } else {


        client.messages
            .create({
                body: 'Realizou o pagamento da taxa de mercados municipais  com uma multa de ' + multa + ' totalizando ' + total + ' MT  na ' + tipo + '   ' + codigo + ' ao Conselho Municipal aos ' + data,
                to: '+258847711160',
                from: '+12057278454',
            })
            .then(message => console.log(message.sid));
    }

}
exports.sendMessage = sendMessage;
exports.getLocal = getLocal;
exports.getPagamento = getPagamento;
exports.mensagem = mensagem;