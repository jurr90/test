'use strict';

var Users = angular.module('Users', [
  'ngRoute',
  'listUserCtrl',
  'addCtrl',
  'editCtrl',
  'authCtrl',
  'regCtrl'
]);

Users.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/auth.html',
        controller: 'authCtrl',
      }).
      when('/registr', {
        templateUrl: 'partials/auth.html',
        controller: 'regCtrl',
      }).
      when('/listUser', {
        templateUrl: 'partials/listUser.html',
        controller: 'listUserCtrl',
        resolve: {
          factory: checkRouting
        }
      }).
      when('/addUser', {
        templateUrl: 'partials/addUser.html',
        controller: 'addCtrl',
        resolve: {
          factory: checkRouting
        }
      }).
      when('/editUser/:id', {
        templateUrl: 'partials/addUser.html',
        controller: 'editCtrl',
        resolve: {
          factory: checkRouting
        }
      }).
      otherwise({
        redirectTo: '/listUser',
      });
  }
]);


var checkRouting = function ($location, $http) {
    $http.get('/api/restricted')
      .success(function (data, status) {
          console.log(data); 
      }).error(function(err){
          console.log(err.error)
          $location.path("/")
      });
};