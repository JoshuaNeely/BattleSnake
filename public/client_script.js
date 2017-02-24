
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var socket = io();
var joined = false;

var background_color = "#333333";
var fruit_color = "#ff0000";
var xsections = 0;
var ysections = 0;
var xinterval = 0
var yinterval = 0
var buffer = 1;

$("#launch_button").click( join );

// ------ controls ------
addEventListener('keydown', function(event) {
  if(event.keyCode == 37) {         // left
    console.log( 'left' );
  }
  else if(event.keyCode == 39) {    // right
    console.log( 'right' );
  }
  else if(event.keyCode == 38) {    // up
    console.log( 'up' );
  }
  else if(event.keyCode == 40) {    // down
    console.log( 'down' );
  }
});

// ------ socket listen events ------
// one-time setup + screen update
socket.on('game_setup', function(setup_data) {	
	xsections = setup_data.game_width;
  ysections = setup_data.game_height;
  xinterval = canvas.width / xsections;
  yinterval = canvas.height / ysections;

  draw_background();

  for (fruit of setup_data.fruit_array) {
    ctx.fillStyle = fruit_color;
    ctx.fillRect(fruit.column * xinterval + buffer, fruit.row * yinterval + buffer, xinterval-buffer, yinterval-buffer);
  }
});

// continuous screen update; only what is *new* since joining
socket.on('screen_update', function(new_data) {
  for (fruit of new_data.new_fruit) {
    ctx.fillStyle = fruit_color;
    ctx.fillRect(fruit.column * xinterval + buffer, fruit.row * yinterval + buffer, xinterval-buffer, yinterval-buffer);
  }
});


// ------ functions ------
function join() {
	if(joined == true)
		return;
  
	joined = true;
	socket.emit("join_game", {});
}

// screen refresh
function draw_background() {
  ctx.fillStyle = background_color;
  ctx.fillRect(0,0, canvas.width, canvas.height);
}

// only draw what cells have changed
function draw_cells(cells) {
  for (var i=0; i<cells.length; i++) {
    ctx.fillStyle = cells[i].color;
    ctx.fillRect( cells[i].x * xinterval + buffer, cells[i].y * yinterval + buffer, xinterval-buffer, yinterval-buffer );
  }
}