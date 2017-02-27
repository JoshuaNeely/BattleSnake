var home = angular.module('home', ['ngRoute']);

home.component('home', {
  templateUrl : '/home.html',
  bindings : {
    homevar : '='
  },
  controller : ['$scope', '$routeParams', HomeController]
});

function HomeController($scope, $routeParams) {  
  $scope.setHome = function() {    
    this.$ctrl.homevar = '42';    
  }
}