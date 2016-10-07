angular.module('app', [])
.controller('controlador', ['$scope','$http', '$timeout', '$location',  function($scope, $http, $timeout, $location) {

	$scope.init = function () {
		$scope.usuario = {
			nome: '',
			senha: ''
		}
	}

	$scope.logar = function () {
		$http.post('/login', $scope.usuario)
		.then(
	        function(response){
	        	if (response.data.token != '') {
	        		window.location.replace($location.$$absUrl+'caixa?token='+response.data.token+'&id='+response.data.id);
	        	}
	        }, 
	        function(response){
	        	console.log(response);
	        }
	    );
	}

}]);