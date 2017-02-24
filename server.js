
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + "/public"));



// ------ globals ------

var sockets_in_game = [];



// intial file served to a connecting browser
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client.html');
});


// ------ listener functions ------
// bound to each unique socket, accessed via 'this'

// disconnect logic
var handle_disconnect = function() {
  console.log("client  " + this.id + "  has left");
  
  // eject from update list if needed
  index = sockets_in_game.indexOf( this );
  if (index >= 0) {
    sockets_in_game.splice(index, 1)
  }
}

// add socket to list of sockets in-game 
var join_game = function() {
  sockets_in_game.push(this);  
}


// ------ bind listeners to socket emit events from browser ------
io.on('connection', function(socket) {		
	console.log("client  " + socket.id + "  has joined");	
	
  socket.on('join_game', join_game.bind(socket) );
	socket.on('disconnect', handle_disconnect.bind(socket) );	
});

// ------ other functions ------
function update_clients()	{		
	for (var i=0; i<sockets_in_game.length; i++) {
		sockets_in_game[i].emit('screen_update', {});
	}	
}

// ------ the main server logic loop ------
var FPS = 20;
setInterval( function() {
  update_clients(); 
}, 1000/FPS);



http.listen(80, function() {		// 80 is default for web browsers visiting a page
  console.log('listening on :80');
});
