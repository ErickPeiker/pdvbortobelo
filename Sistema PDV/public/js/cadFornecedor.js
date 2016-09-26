angular.module('app', [])
.controller('controlador', function($scope, $http) {

	$scope.init = function () {
		$scope.getFornecedores();
		$scope.reset();
	}

	$scope.reset = function () {
		$scope.ativado = true;
		$scope.fornecedor = {
			nome: '',
			contato: '',
			telefone:'',
			endereco:'',
			observacoes:'',
			ativo: true
		}
	}

	$scope.salvar = function () {
		$scope.fornecedor.ativo = $scope.ativado;

	}

	$scope.getFornecedores = function () {

	}

	$scope.cancelar = function () {
		if (confirm('Deseja limpar a tela?')) {
			$scope.reset();
		}
	}

	$scope.editar = function (fornecedorEditado) {
		$scope.fornecedor = fornecedorEditado;
		$scope.ativado = fornecedorEditado.ativo;
		
	}

});