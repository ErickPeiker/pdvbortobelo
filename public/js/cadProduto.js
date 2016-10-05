angular.module('app', [])
.controller('controlador', ['$scope','$http', '$timeout',  function($scope, $http, $timeout) {

	$scope.init = function () {
		$('[data-toggle="popover"]').popover();
		$scope.reset();
		$scope.limpaAlerts();
		$scope.getCategorias();
		$scope.getProdutos();
	}

	$scope.reset = function () {
		$scope.produtos = [];
		$scope.limpaTela();
		$scope.getProdutos();
	}

	$scope.limpaAlerts = function () {
        $('#alerts').modal('hide');
        $scope.alerts = [];
    }

	$scope.limpaTela = function () {
		$scope.limpaProduto();
	}

	$scope.limpaProduto = function () {
		$scope.gerarAutomatico = false;
		$scope.ativado = true;
		$scope.produto = {
			id: 0,
			codigo:'',
			codigobarras:'',
			descricao: '',
			idcategoria: '',
			fornecedor: '',
			precoCompra: '',
			precoUnitario: '',
			quantidadeEstoque: '',
			estoqueminimo: '',
			ativo: true
		}
	}

	$scope.getCodigoNovo = function () {
		if ($scope.gerarAutomatico) {
			$http.get('/produto/codigo')
			.then(
		        function(response){
		        	$scope.produto.codigo = response.data[0].nextval;
		        }, 
		        function(response){
		        	console.log(response);
		        	$scope.produto.codigo = '';
		        }
		    );
		} else {
			$scope.produto.codigo = '';
		}
		
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
	        }, 
	        function(response){
	        	console.log(response);
	        }
	    );
	}

	$scope.valida = function () {
        if ($scope.produto.codigo.length == 0) {
            $scope.alerts.push({
                tipo: 3,
                titulo: 'Código',
                texto: 'Código do produto precisa ser informado'
            });
        }
        if ($scope.produto.descricao.length == 0) {
            $scope.alerts.push({
                tipo: 3,
                titulo: 'Descrição',
                texto: 'O produto precisa de um nome'
            });
        }
        if ($scope.produto.idcategoria.length == 0) {
            $scope.alerts.push({
                tipo: 3,
                titulo: 'Categoria',
                texto: 'O produto precisa de uma categoria'
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
			$scope.produto.ativo = $scope.ativado;
			$http.post('/produto/save', $scope.produto)
			.then(
		        function(response){
		        	$scope.reset();
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
		$scope.produtos = [];
	}

	$scope.excluir = function (idProduto) {
		if (confirm('Você deseja excluir este produto ?')) {
			$http.post('/produto/excluir', {id: idProduto})
			.then(
		        function(response){
		        	$scope.reset();
		        }, 
		        function(response){
		        	console.log(response);
		        }
		    );
		}		
	}

}])
.directive('format', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;

            ctrl.$formatters.unshift(function (a) {
                return $filter(attrs.format)(ctrl.$modelValue)
            });

            ctrl.$parsers.unshift(function (viewValue) {
                if (viewValue.length <= 3) {
                    viewValue = '00'+viewValue;
                }
                var value = viewValue;
                value = value.replace(/\D/g,"");
                value = value.replace(/(\d{2})$/,",$1");
                value = value.replace(/(\d+)(\d{3},\d{2})$/g,"$1.$2");
                var qtdLoop = (value.length-3)/3;
                var count = 0;
                while (qtdLoop > count)
                {
                    count++;
                    value = value.replace(/(\d+)(\d{3}.*)/,"$1.$2");
                }
                var plainNumber = value.replace(/^(0)(\d)/g,"$2");

                elem.val(plainNumber);
                return plainNumber;
            });

            elem.bind('blur', function () {
                var valueFilter = elem.val();
                valueFilter = valueFilter.replace(/\D/g,"");
                if (attrs.zeroFilter == 'true') {
                    if (valueFilter == 0) {
                        elem.val('');
                    }
                }
            });
        }
    };
}])