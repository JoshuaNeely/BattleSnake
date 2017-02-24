
(function(){
  module.exports = {
    random : function(min, max) { return local_random(min,max); },
    gen_2d_matrix : function(r, c, d) { return local_gen_2d_matrix(r,c,d); }
  }
}());

// ------ local functions to be exported ------
function local_random(min, max) {
  return Math.floor(Math.random()*(max-min+1))+min;
}

function local_gen_2d_matrix(rows, columns, initial_data) {
  var matrix = [];
  for (var x=0; x<columns; x++) {
    matrix.push( [] );
    for (var y=0; y<rows; y++) {
      matrix[x].push( initial_data );
    }
  }
  return matrix;
}