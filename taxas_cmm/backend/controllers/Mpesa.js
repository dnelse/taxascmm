


function Mpesa() {
    // access token
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
                        "Amount": "200",
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
                            console.log(body);
                        }
                    }
                )






                // let resp = 
                // return JSON.parse(body).access_token
               
            }
        }
    )
}




router.post('/b2c_result_url', (req, res) => {
    console.log("-------------------- B2C Result -----------------")
    console.log(JSON.stringify(req.body.Result))
})

router.post('/b2c_timeout_url', (req, res) => {
    console.log("-------------------- B2C Timeout -----------------")
    console.log(req.body)
})