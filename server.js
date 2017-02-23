
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static(__dirname + "/public"));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/client.html');
});