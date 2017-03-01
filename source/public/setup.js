var setup = angular.module('setup', ['ngRoute']);

setup.component('setup', {
  templateUrl : '/setup.html',
  bindings : {
    data : '='
  },
  controller : ['$scope', '$routeParams', '$location', SetupController]
});


function SetupController($scope, $routeParams, $location) {  

  $scope.data = {
    name : "Guest",
    availableOptions : [
      {color_name : 'white',    color_value : "#ffffff"},
      {color_name : 'red',      color_value : "#ff1e1e"},
      {color_name : 'blue',     color_value : "#3c46c8"},
      {color_name : 'green',    color_value : "#23b450"},
      {color_name : 'orange',   color_value : "#ff8228"},
      {color_name : 'yellow',   color_value : "#ffff00"},
      {color_name : 'purple',   color_value : "#a050a0"},
      {color_name : 'pink',     color_value : "#ffb4c8"}     
    ]
  }

  $scope.data.selectedOption = $scope.data.availableOptions[0];

  $scope.submitForm = function() {    
    this.$ctrl.data = {name: $scope.data.name, color: $scope.data.selectedOption.color_value};
    $location.path('/home');
  }
}
