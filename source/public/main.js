var main = angular.module('mainApp', ['ngRoute', 'home', 'setup', 'game']);

main.config(['$locationProvider', '$routeProvider',
  function config($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.
      when('/home', {
        template : '<home homevar=ctrl.test1></home>'
      }).
      when('/setup', {
        template : '<setup test=ctrl.test1></setup>'
      }).
      when('/game', {
        template : '<game></game>'
      }).
      otherwise('/home');
  }
]);

main.controller('MainController', function MainController($scope, $location) {
  
});


/*
menu.config(['routeProvider', function($routeProvider) {
  $routeProvider.
    when('/client')
}]);

menu.controller('MenuController', function MenuController($scope, $location) {
  $scope.data = {
    availableOptions : [
      {name : 'red', value : "#ff0000"},
      {name : 'blue', value : "#0000ff"},
      {name : 'green', value : "#00ff00"}
    ]
  }

  $scope.submitForm = function() {
    console.log( 'selected color:', $scope.data.selectedOption );
    $location.path('client.html');
  }
});
*/