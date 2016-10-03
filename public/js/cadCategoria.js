angular.module('app', [])
.controller('controlador', function($scope, $http) {

	$scope.init = function () {
		$scope.reset();
		$scope.getCategorias();
	}

	$scope.reset = function () {
		$scope.categorias = [];
		$scope.limpaCampos();
	}

	$scope.limpaCampos = function (){
		$scope.ativado = true;
		$scope.categoria = {
			id: 0,
			nome: '',
			ativo: true
		}
	}

	$scope.getCategorias = function () {
		$http.get('/categoria/todos')
		.then(
	        function(response){
	        	$scope.categorias = response.data;
	        }, 
	        function(response){
	        	console.log(response);
	        }
	    );
	}

	$scope.salvar = function () {
		$scope.categoria.ativo = $scope.ativado;
		$http.post('/categoria/save', $scope.categoria)
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

	$scope.excluir = function (idCategoria) {
		if (confirm('Você deseja excluir esta categoria ?')) {
			$http.post('/categoria/excluir', {id: idCategoria})
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

	$scope.cancelar = function () {
		if (confirm('Deseja limpar a tela?')) {
			$scope.limpaCampos();
		}
	}

	$scope.editar = function (categoriaEditada) {
		$scope.categoria = categoriaEditada;
		$scope.ativado = categoriaEditada.ativo;
		
	}

});