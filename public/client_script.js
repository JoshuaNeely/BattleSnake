
var socket = io();
var joined = false;

$("#launch_button").click( join );

function join() {
	if(joined == true)
		return;
  
	joined = true;
	socket.emit("join_game", {});
}

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