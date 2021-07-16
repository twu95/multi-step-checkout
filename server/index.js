const express = require('express');
const getPaymentMethods = require('./getPaymentMethods.js').getPaymentMethods;
const pay = require('./payment.js').pay;
let app = express();

let loggerRequest = (req, res, next) => {
  console.log(`Received ${req.method} for ${req.url}`);
  next();
};


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerRequest);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.static(__dirname + '/../client/dist'));


app.all('/paymentMethods', function (req, res) {
  getPaymentMethods(req.body, res);
});

app.all('/payments', (req, res) => {
  pay(req.body, res);
});



let port = process.env.PORT || 1128;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

