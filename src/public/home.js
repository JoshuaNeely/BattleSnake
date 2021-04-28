var home = angular.module('home', ['ngRoute']);

home.component('home', {
  templateUrl : '/home.html',
  bindings : {},
  controller : ['$scope', '$routeParams', HomeController]
});

function HomeController($scope, $routeParams) {  
}