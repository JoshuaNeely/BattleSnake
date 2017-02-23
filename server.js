
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + "/public"));


// intial file served to a connecting browser
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client.html');
});




// on each browser connection, add listeners for different events
io.on('connection', function(socket) {		
	console.log("client  " + socket.id + "  has joined");	
		
	socket.on('disconnect', handle_disconnect.bind(socket) );	
});

// listener functions
// bound to each unique socket, accessed via 'this'
var handle_disconnect = function() {
  console.log("client  " + this.id + "  has left");
}

var sockets_connected = [];


http.listen(80, function() {		// 80 is default for web browsers visiting a page
  console.log('listening on :80');
});