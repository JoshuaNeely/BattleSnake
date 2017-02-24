


(function(){
  module.exports = {
    random : function(min, max) { return local_random(min,max); }
  }
}());


function local_random(min, max) {
  return Math.floor(Math.random()*(max-min+1))+min;
}