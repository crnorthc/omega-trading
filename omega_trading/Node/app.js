var express = require('express');
var Web3 = require('web3')
var app = express();

const hostname = '127.0.0.1';
const port = 3000;

app.post('/test', function (req, res) {
    var web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545')
    const account = web3.eth.getBalance("0x0f02Db545f690e3D673BAB2CAD6Ed1981A422f56")
    var rest = {'Success': account}
    res.end( JSON.stringify(rest));
 })

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
 })