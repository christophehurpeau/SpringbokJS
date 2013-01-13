var express = require('express');
var app = express.createServer();

app.use(express.vhost('dev.example.com', require('./dev').app));

app.listen(8080);


/*
 * http://www.devthought.com/2012/01/29/staying-up-with-node-js/
 * https://github.com/learnboost/up
 * https://github.com/learnboost/distribute
 */