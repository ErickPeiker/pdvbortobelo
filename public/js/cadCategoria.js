angular.module('app', [])
.controller('controlador', ['$scope','$http', '$timeout',  function($scope, $http, $timeout) {

	$scope.init = function () {
		$scope.reset();
		$scope.limpaAlerts();
	}

	$scope.reset = function () {
		$scope.limpaCampos();
		$scope.getCategorias();
	}

	$scope.limpaCampos = function (){
		$scope.ativado = true;
		$scope.categoria = {
			id: 0,
			nome: '',
			ativo: true
		}
	}

	$scope.limpaAlerts = function () {
        $('#alerts').modal('hide');
        $scope.alerts = [];
    }

	$scope.getCategorias = function () {
		$scope.categorias = [];
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

	$scope.valida = function () {
        if ($scope.categoria.nome.length == 0) {
            $scope.alerts.push({
                tipo: 3,
                titulo: 'Categoria',
                texto: 'Deê um nome para a categoria'
            });
        }

        $timeout($scope.limpaAlerts, 10000);
        if ( $scope.alerts.length > 0) {
            $('#alerts').modal();
            return false;
        } else {
            return true;
        }
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
			$scope.reset();
		}
	}

	$scope.editar = function (categoriaEditada) {
		$scope.categoria = categoriaEditada;
		$scope.ativado = categoriaEditada.ativo;
		$scope.categorias = [];
	}

}]);