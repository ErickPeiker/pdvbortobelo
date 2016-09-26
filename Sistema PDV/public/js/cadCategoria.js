angular.module('app', [])
.controller('controlador', function($scope, $http) {

	$scope.init = function () {
		$scope.getCategorias();
		$scope.reset();
	}

	$scope.reset = function () {
		$scope.ativado = true;
		$scope.categoria = {
			nome: '',
			ativo: true
		}
	}

	$scope.getCategorias = function () {

	}

	$scope.salvar = function () {
		$scope.categoria.ativo = $scope.ativado;

	}

	$scope.cancelar = function () {
		if (confirm('Deseja limpar a tela?')) {
			$scope.reset();
		}
	}

	$scope.editar = function (categoriaEditada) {
		$scope.categoria = categoriaEditada;
		$scope.ativado = categoriaEditada.ativo;
		
	}

});