
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var socket = io();
var joined = false;

var background_color = "#333333";
var xsections = 50;
var ysections = 50;
var xinterval = canvas.width / xsections;
var yinterval = canvas.height / ysections;
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
socket.on('screen_update', function() {	
	draw_background();	
});


// ------ functions ------
function join() {
	if(joined == true)
		return;
  
	joined = true;
	socket.emit("join_game", {});
}

function draw_background() {
  ctx.fillStyle = background_color;
  ctx.fillRect(0,0, canvas.width, canvas.height);
}

function draw_cells(cells) {
  for (var i=0; i<cells.length; i++) {
    ctx.fillStyle = cells[i].color;
    ctx.fillRect( cells[i].x * xinterval + buffer, cells[i].y * yinterval + buffer, xinterval-buffer, yinterval-buffer );
  }
}