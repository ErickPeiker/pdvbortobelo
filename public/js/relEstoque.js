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

	$scope.getTotalCompra = function () {
		var total = 0;
		for (index in $scope.estoque) {
			var item = $scope.estoque[index];
			total += (item.preco_compra * item.estoque);
		}
		return total;
	}

	$scope.getTotalVenda = function () {
		var total = 0;
		for (index in $scope.estoque) {
			var item = $scope.estoque[index];
			total += (item.preco_venda * item.estoque);
		}
		return total;
	}


});