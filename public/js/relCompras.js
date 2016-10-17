angular.module('app', [])
.controller('controlador', function($scope, $http) {

	$scope.init = function () {
		var dataBase = new Date();
		var inicio = new Date(dataBase.getFullYear(),
                         		dataBase.getMonth() -1,
                         		dataBase.getDate());
		var final = dataBase;

		$http.get('/relatorio/get-compras?inicio='+inicio.toISOString()+'&fim='+final.toISOString())
		.success(function(response){
                var itensRetorno = response[0].rows;
                $scope.listaDiaCompleta = itensRetorno;    
            })
		.error(function(response){
            console.log(response);
        });
	}

	$scope.detalhes = function (dia) {
		$http.get('/relatorio/get-compras-detalhes?dia='+dia)
		.success(function(response){
            var itensRetorno = response[0].rows;
            $scope.compras = itensRetorno;
            $('#resultadoDetalhes').modal();
        })
		.error(function(response){
            console.log(response);
        });
	}


});