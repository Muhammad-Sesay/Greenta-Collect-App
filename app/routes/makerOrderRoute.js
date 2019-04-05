var express = require('express');
var router = express.Router();
var orderData = require('../data/productOrders.json');
var fs = require('fs');

router.post('/order', (req, res, next) =>{

    var name = req.body.name;
    var address = req.body.address;
    var email = req.body.email;
    var telephone = parseInt(req.body.price);
    var product = req.body.product;
    var quantity = req.body.quantity;

    // orderData.unshift({name,address,email,telephone,product,quantity}); //posting the data into the api

    // writing the data
    fs.writeFile('../data/productOrders.json', JSON.stringify(orderData), 'utf8',function(err){});
  

});

module.exports = router;
