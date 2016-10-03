angular.module('app', [])
.controller('controlador', function($scope, $http) {

	$scope.init = function () {
		$scope.getFornecedores();
		$scope.reset();
	}

	$scope.reset = function () {
		$scope.ativado = true;
		$scope.fornecedor = {
			id: 0,
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
		$http.post('/fornecedor/save', $scope.fornecedor)
		.then(
	        function(response){
	        	console.log(response);
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