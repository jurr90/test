//Список всех юзеров
var listUserCtrl = angular.module('listUserCtrl', []);

listUserCtrl.controller("listUserCtrl",
	function ($scope, $http, $location,$window) {
		

		$http.get('user').success(function(data) {
		    $scope.users = data;
		});

		$scope.add = function() {
			$location.path("/addUser");
		}
		
		$scope.edit = function(id) {
			$location.path("/editUser/" + id)
		}

		$scope.delete = function(id) {
			$http.delete('user/' + id).success(function(data) {
			    if (data.status === "OK") {
					$location.path("/listUser/")
			    } 
			})
		}

		$scope.endAuth = endAuth($window, $location)
	}
)

//Добавить юзера
var addCtrl = angular.module('addCtrl', []);

addCtrl.controller("addCtrl",
	function ($scope, $http, $location, $window) {
		
		$scope.submit = function() {
	    	$http.post('user', this.user).success(function(data) {
			    if (data.status === "OK") {
					$location.path("/listUser/")
			    }
			})
	  	}

		$scope.endAuth = endAuth($window, $location)
	}
)

//Измень юзера
var editCtrl = angular.module('editCtrl', []);

editCtrl.controller("editCtrl",
  	function ($scope, $routeParams, $http, $location, $window) {
  		
	    $http.get('user/' + $routeParams.id).success(function(data) {
	      	$scope.user = data.article;
    	});

    	$scope.submit = function() {
	    	$http.put('user/'  + $routeParams.id, this.user).success(function(data) {
			   	if (data.status === "OK") {
			   		$location.path("/listUser");
			   	}
			})
	  	}

		$scope.endAuth = endAuth($window, $location)
	}
)

//Регистрация
var regCtrl = angular.module('regCtrl', []);

regCtrl.controller("regCtrl", 
	function ($scope, $http, $location) {
		$scope.headPage = "Регистрация";
		$scope.valueButton = "Регистрация";


		$scope.submit = function() {
			if (!$scope.moderator || !($scope.moderator.username && $scope.moderator.password)) {
			 	return $scope.errorMessage = 'Error: Заполните все поля';
			}
	    	$http.post('registr', this.moderator).success(function(data) {
			    if (data.status === "OK") {
					$location.path("/")
			    }
			})
	  	}
	}
)

//Авторизация
var authCtrl = angular.module('authCtrl', []);

authCtrl.controller("authCtrl", 
	function ($scope, $http, $window, $location) {
		$scope.headPage = "Авторизация";
		$scope.registr = "Регистрация";
		$scope.valueButton = "Авторизация"
	    $scope.message = '';

	    $scope.submit = function () {
		  	if (!$scope.moderator || !($scope.moderator.username && $scope.moderator.password)) {
		  		return $scope.errorMessage = 'Error: Заполните все поля';
		  	}

		    $http
		        .post('/authenticate', $scope.moderator)
		        .success(function (data, status, headers, config) {
		        	$window.sessionStorage.token = data.token;
		    		$location.path("/listUser")
		        })
		        .error(function (data, status, headers, config) {
		        	delete $window.sessionStorage.token;

		        	if (status === 401) {
		        		$scope.errorMessage = 'Error: Такой пользователь не найден, попробуйте зарегистрироватся!';
		        	}
		      	});
	  }
})


authCtrl.factory('authInterceptor', 
	function ($rootScope, $q, $window) {
    	var defered = $q.defer(); 
  		return {
		    request: function (config) {
		      config.headers = config.headers || {};
		      if ($window.sessionStorage.token) {
		        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
		      }
		      return config;
		    },
		    response: function (response) {
		      return response || $q.when(response);
		    }
  		}
	}
);

authCtrl.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});

var endAuth = function($window, $location) {
	return function() {
		$location.path("/")
		delete $window.sessionStorage.token;
	}
}