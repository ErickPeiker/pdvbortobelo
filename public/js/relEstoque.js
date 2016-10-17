angular.module('app', [])
.controller('controlador', function($scope, $http) {

	$scope.init = function () {
		$http.get('/relatorio/get-estoque')
		.success(function(response){
                $scope.estoque = response[0].rows;    
            })
		.error(function(response){
            console.log(response);
        });
	}

	$scope.getTotal = function () {
		var total = 0;
		for (index in $scope.estoque) {
			var item = $scope.estoque[index];
			total += (item.preco * item.estoque);
		}
		return total;
	}


});