angular.module('app', [])
.controller('controlador', ['$scope','$http', '$timeout',  function($scope, $http, $timeout) {

	$scope.init = function () {
		$scope.reset();
		$scope.limpaAlerts();
	}

	$scope.reset = function () {
		$scope.getFornecedores();
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

	$scope.limpaAlerts = function () {
        $('#alerts').modal('hide');
        $scope.alerts = [];
    }

	$scope.valida = function () {
		if ($scope.fornecedor.nome.length == 0) {
            $scope.alerts.push({
                tipo: 3,
                titulo: 'Fornecedor',
                texto: 'Informe o nome da empresa que efetua as compras'
            });
        }
        if ($scope.fornecedor.contato.length == 0) {
            $scope.alerts.push({
                tipo: 3,
                titulo: 'Nome do Contato',
                texto: 'Informe o nome da pessoa que é feito as negociações'
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
		if ($scope.valida()) {
			$scope.fornecedor.ativo = $scope.ativado;
			$http.post('/fornecedor/save', $scope.fornecedor)
			.then(
		        function(response){
		        	$scope.reset();
		        }, 
		        function(response){
		        	console.log(response);
		        	$scope.reset();
		        }
		    );
		}
	}

	$scope.getFornecedores = function () {
		$scope.fornecedores = [];
		$http.get('/fornecedor/todos')
		.then(
	        function(response){
	        	$scope.fornecedores = response.data;
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
		$scope.fornecedores = [];		
	}

}]);