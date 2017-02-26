var menu = angular.module('menu', []);

menu.controller('MenuController', function MenuController($scope) {
  $scope.data = {
    availableOptions : [
      {name : 'red', value : "#ff0000"},
      {name : 'blue', value : "#0000ff"},
      {name : 'green', value : "#00ff00"}
    ]
  }
});