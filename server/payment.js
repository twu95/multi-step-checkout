const { CHECKOUT_APIKEY, CHECKOUT_URL, MERCHANT_ACCOUNT } = require('../config');
const axios = require('axios');


exports.pay = (req, res) => {

  let endpoint = 'payments';

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'X-Api-Key': CHECKOUT_APIKEY
  };

  let data = JSON.stringify(
    {
      merchantAccount: MERCHANT_ACCOUNT,
      amount: {
        currency: "USD",
        "value": 1000
      },
      reference: Math.random() * 100000,
      returnUrl: 'https://cnn.com',
      ...req
    });

    axios.post(`${CHECKOUT_URL}/${endpoint}`, data, {headers: headers})
    .then((body) => {
      return res.send(body.data);
    })
    .catch((err) => {
      console.error(err);
      return res.send(err);
    });



};

