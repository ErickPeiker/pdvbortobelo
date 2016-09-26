angular.module('app', [])
.controller('controlador', function($scope, $http) {

	$scope.init = function () {
		$scope.getProdutos();
		$scope.getCategorias();
		$scope.getFornecedores();
		$scope.reset();
	}

	$scope.reset = function () {
		$scope.ativado = true;
		$scope.produto = {
			codigo:'',
			codigoBarras:'',
			descricao: '',
			categoria: '',
			fornecedor: '',
			precoCompra: '',
			precoUnitario: '',
			quantidadeEstoque: '',
			ativo: true
		}
	}

	$scope.getCodigoNovo = function () {
		$scope.produto.codigo = 0;
	}

	$scope.getCategorias = function () {

	}

	$scope.getFornecedores = function () {
		
	}

	$scope.salvar = function () {

	}

	$scope.cancelar = function () {
		if (confirm('Deseja limpar a tela?')) {
			$scope.reset();
		}
	}

	$scope.getProdutos = function () {

	}

	$scope.editarProduto = function (produtoEditado) {
		$scope.produto = produtoEditado;
	}

});