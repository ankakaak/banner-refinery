
var express = require('express');

var app = express();

app.use(express.static(__dirname + '/out'));

app.listen(3000);

console.log("Listening at port 3000.");