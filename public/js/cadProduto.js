angular.module('app', [])
.controller('controlador', function($scope, $http) {

	$scope.init = function () {
		$scope.reset();
		$scope.getCategorias();
		$scope.getFornecedores();
		$scope.getProdutos();
	}

	$scope.reset = function () {
		$scope.produtos = [];
		$scope.limpaTela();
	}

	$scope.limpaTela = function () {
		$scope.ativado = true;
		$scope.produto = {
			id: 0,
			codigo:'',
			codigoBarras:'',
			descricao: '',
			categoria: '',
			fornecedor: '',
			precoCompra: '',
			precoUnitario: '',
			quantidadeEstoque: '',
			estoqueMinimo: '',
			ativo: true
		}
	}

	$scope.getCodigoNovo = function () {
		$http.get('/produto/codigo')
		.then(
	        function(response){
	        	$scope.produto.codigo = response.data;
	        }, 
	        function(response){
	        	console.log(response);
	        }
	    );
	}

	$scope.getNomeCategoria = function (idCategoria) {
		for (index in $scope.categorias) {
			if ($scope.categorias[index].id == idCategoria) {
				return $scope.categorias[index].nome;
			}
		}
	}

	$scope.getCategorias = function () {
		$http.get('/categoria/todos')
		.then(
	        function(response){
	        	$scope.categorias = response.data;
	        	console.log($scope.categorias);
	        }, 
	        function(response){
	        	console.log(response);
	        }
	    );
	}

	$scope.getFornecedores = function () {
		$http.get('/fornecedor/todos')
		.then(
	        function(response){
	        	$scope.fornecedores = response.data;
	        	console.log($scope.fornecedores);
	        }, 
	        function(response){
	        	console.log(response);
	        }
	    );
	}

	$scope.salvar = function () {
		$scope.produto.ativo = $scope.ativado;
		$http.post('/produto/save', $scope.produto)
		.then(
	        function(response){
	        	console.log(response);
	        }, 
	        function(response){
	        	console.log(response);
	        }
	    );
	}

	$scope.cancelar = function () {
		if (confirm('Deseja limpar a tela?')) {
			$scope.reset();
		}
	}

	$scope.getProdutos = function () {
		$http.get('/produto/todos')
		.then(
	        function(response){
	        	$scope.produtos = response.data;
	        }, 
	        function(response){
	        	console.log(response);
	        }
	    );
	}

	$scope.editar = function (produtoEditado) {
		$scope.produto = produtoEditado;
	}

	$scope.excluir = function (idProduto) {
		if (confirm('Você deseja excluir esta categoria ?')) {
			$http.post('/categoria/excluir', {id: idProduto})
			.then(
		        function(response){
		        	$scope.reset();
		        	$scope.getCategorias();
		        }, 
		        function(response){
		        	console.log(response);
		        }
		    );
		}		
	}

});