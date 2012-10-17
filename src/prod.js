var express = require('express');
var app = express.createServer();

app.use(express.vhost('dev.example.com', require('./dev').app));

app.listen(8080);
