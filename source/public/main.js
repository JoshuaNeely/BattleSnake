var main = angular.module('mainApp', ['ngRoute', 'home', 'setup', 'game']);

main.config(['$locationProvider', '$routeProvider',
  function config($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.
      when('/home', {
        template : '<home></home>'
      }).
      when('/setup', {
        template : '<setup data=ctrl.player_data></setup>'
      }).
      when('/game', {
        template : '<game data=ctrl.player_data></game>'
      }).
      otherwise('/home');
  }
]);

main.controller('MainController', function MainController($scope, $location) {
  this.player_data = {name:'guest', color:'#dddddd'};
});