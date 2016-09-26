angular.module('app', [])
.controller('controlador', function($scope, $http) {

	$scope.init = function () {
		$scope.getUsuarios();
		$scope.reset();
	}

	$scope.reset = function () {
		$scope.ativado = true;
		$scope.usuario = {
			nome: '',
			senha: '',
			ativo: true
		}
	}

	$scope.getUsuarios = function () {

	}

	$scope.salvar = function () {
		$scope.usuario.ativo = $scope.ativado;

	}

	$scope.cancelar = function () {
		if (confirm('Deseja limpar a tela?')) {
			$scope.reset();
		}
	}

	$scope.editar = function (usuarioEditado) {
		$scope.fornecedor = usuarioEditado;
		$scope.ativado = usuarioEditado.ativo;
		
	}


});