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
      {color_name : 'white',  color_value : "#ffffff"},
      {color_name : 'red',    color_value : "#ff0000"},
      {color_name : 'blue',   color_value : "#0000ff"},
      {color_name : 'green',  color_value : "#00ff00"}
    ]
  }

  $scope.data.selectedOption = $scope.data.availableOptions[0];

  $scope.submitForm = function() {    
    this.$ctrl.data = {name: $scope.data.name, color: $scope.data.selectedOption.color_value};
    $location.path('/home');
  }
}
