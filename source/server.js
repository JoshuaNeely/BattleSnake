
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + "/public"));

var u = require('./utilities.js');

// ------ globals ------
var game_width = 50;
var game_height = 50;
var sockets_watching = [];
var game_matrix = u.gen_2d_matrix(game_height, game_width, {});
var max_fruit_in_game = 5;
var fruit_array = [];
var snake_array = [];

var new_fruit = []; // freshly spawned fruit; information to be sent to every client
var new_segments = [];

// intial file served to a connecting browser
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html'); //client.html');
});


// ------ listener functions ------
// bound to each unique socket, accessed via 'this'

// disconnect logic
var handle_disconnect = function() {  
  // eject from update list if needed
  var index = sockets_watching.indexOf( this );
  if (index >= 0) {
    console.log( this.id, 'removed from watching sockets' );
    sockets_watching.splice(index, 1)
  }

  leave_game.call(this);
}

var join_game = function(player_data) {
  console.log("client  " + this.id + " joined the game");

  var index = sockets_watching.indexOf(this);  
  if (index >= 0) {  
    snake_array.push( new Snake( sockets_watching[index], player_data ) );
    this.snake = snake_array[snake_array.length-1];    
  }  
}

var leave_game = function() {
  console.log("client " + this.id + " has left the game" );

  if (this.snake) {
    this.snake.alive = false;
    this.snake.no_respawn = true;
    this.snake.parent = null;
  }
}

var player_input = function(direction) {
  if (!this.snake) {
    return;
  }

  if (this.snake.direction.x != direction.x*-1 || this.snake.direction.y != direction.y*-1) {
    this.snake.direction = direction;
  }
}

// ------ bind listeners to socket emit events from browser ------
io.on('connection', function(socket) {		
	console.log("client  " + socket.id + " added to watching sockets");

  sockets_watching.push(socket);

  var segment_array = [];
  for (snake of snake_array) {
    for (segment of snake.segments) {
      segment_array.push( {row:segment.row, column:segment.column, color:snake.color} );
    }
  }
  
  var initial_data = {
    game_width : game_width,
    game_height : game_height,
    fruit_array : fruit_array,
    segment_array : segment_array,    
  }
  this.emit('game_setup', initial_data);

	
  socket.on('join_game', join_game.bind(socket) );
  socket.on('leave_game', leave_game.bind(socket) );
	socket.on('disconnect', handle_disconnect.bind(socket) );     // generated by actual disconnect event
  socket.on('stop_watching', handle_disconnect.bind(socket) );  // can't emit 'disconnect' for some reason
  socket.on('direction_control', player_input.bind(socket) );
});

// ------ other functions ------
function update_game() {
  // initialize fruit and replace as the game goes on
  while (fruit_array.length < max_fruit_in_game) {
    spawn_fruit(1);
  }

  for (var snake of snake_array) {    
    var head = snake.segments[0];

    if (snake.alive) {
      // move snake forward
      var new_pos = {column : head.column + snake.direction.x, row : head.row + snake.direction.y};
      
      if (validate_position(new_pos)) {
        // handle fruit collision
        collided_fruit = game_matrix[new_pos.row][new_pos.column].fruit;
        if (collided_fruit) {
          snake.size += collided_fruit.nutrition;
          for (var i=0; i<fruit_array.length; i++) {
            if (fruit_array[i].row == new_pos.row && fruit_array[i].column == new_pos.column) {
              fruit_array.splice(i,1);
            }
          }
          game_matrix[new_pos.row][new_pos.column].fruit = null;
        }
        
        // update animation and collision data
        new_segments.push( {row:new_pos.row, column:new_pos.column, color:snake.color} );
        game_matrix[new_pos.row][new_pos.column].snake = true;
        // move head of snake forward
        snake.segments.unshift( new_pos );
      } else {
        snake.alive = false;
      }
    } else {
      snake.size -= 1;
      if (snake.size < 0) {
        if (snake.parent) {          
          snake.respawn();
        }
      }
    }

    // remove the end of the snake as it moves forward
    if(snake.segments.length > snake.size && snake.segments.length) {
      var removed = snake.segments.pop();
      new_segments.push( {row:removed.row, column:removed.column, color:'#333333'} );
      game_matrix[removed.row][removed.column].snake = null;
    }
  }
}

function update_clients()	{
	for (var i=0; i<sockets_watching.length; i++) {
    var update_data = {
      new_fruit : new_fruit,
      new_segments : new_segments
    }
		sockets_watching[i].emit('screen_update', update_data);
	}
  new_fruit = [];
  new_segments = [];
}

function cleanup_clients() {
  // cleanup unneeded sockets
  for (var i=0; i<snake_array.length; i++) {
    if (!snake_array[i].parent && snake_array[i].size < 0) {
      snake_array.splice(i, 1)
    } 
  }
}

function spawn_fruit(number_fruit) {
  for(var i=0; i<number_fruit; i++) {
    // find a tile where there is not already a fruit...
    var found = false;
    while (!found) {
      var row = u.random(0, game_height-1);
      var col = u.random(0, game_width-1);
      if (!game_matrix[row][col].fruit && !game_matrix[row][col].snake) {
        f = new Fruit(row, col);
        game_matrix[row][col].fruit = f;
        fruit_array.push( f );
        new_fruit.push( f );
        found = true;        
      }
    }
  }
}

function validate_position(position) {
  var p = position;

  // check out of bounds
  if (p.row < 0 || p.row >= game_height || p.column < 0 || p.column >= game_width) {
    return false;
  }
  
  // check collision with other snakes
  if (game_matrix[p.row][p.column].snake) {
    return false;
  }
  
  return true;
}

// ------ classes ------
function Snake(parent_socket_reference, player_data) {
  // ------ local variables ------  
  this.color = player_data.color;
  this.name = player_data.name;
  this.parent = parent_socket_reference;  // a reference to the parent; if it leaves this should be null
  
  // ------ methods ------
  this.respawn = function() {   
    this.segments = [ {column:0, row:0} ];
    this.direction = {x:1, y:0};
    this.size = 3;
    this.alive = true;
    
    this.parent.emit('respawned', {initial_direction:this.direction});
  };

  this.respawn();
}

function Fruit(row, col) {
  // ------ local variables ------
  if (u.random(0,5) == 0) {
    this.nutrition = 5;
    this.color = "#00ff00";
  } else {
    this.nutrition = 1;
    this.color = "#ff0000";
  }
  this.row = row;
  this.column = col;
}

// ------ the main server logic loop ------
var FPS = 10;
setInterval( function() {
  update_game();
  update_clients();
  cleanup_clients();
}, 1000/FPS);



http.listen(80, function() {		// 80 is default for web browsers visiting a page
  console.log('listening on :80');
});
