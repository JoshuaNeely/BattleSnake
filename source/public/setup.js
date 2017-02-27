var setup = angular.module('setup', ['ngRoute']);

setup.component('setup', {
  templateUrl : '/setup.html',
  bindings : {
    test : '='
  },
  controller : ['$scope', '$routeParams', '$location', SetupController]
});


function SetupController($scope, $routeParams, $location) {
  $scope.data = {
    availableOptions : [
      {color_name : 'red',    color_value : "#ff0000"},
      {color_name : 'blue',   color_value : "#0000ff"},
      {color_name : 'green',  color_value : "#00ff00"}
    ]
  }

  $scope.submitForm = function() {    
    this.$ctrl.test = $scope.data.selectedOption;
    $location.path('/home');
  }
}
