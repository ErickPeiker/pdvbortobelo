angular.module('app', [])
.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
					scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
})
.controller('controlador', ['$scope','$http', '$interval', function($scope, $http, $interval) {
	$scope.init = function () {
		$scope.limpaPesquisa();
		$scope.limpaResultadoPesquisa();
		$scope.limpaCompra();

		$interval(function() {
    		$scope.getHoraSistema();
    	}, 60000);
	}

	$scope.getHoraSistema = function () {
		//$scope.horarioServidor = 
	}

	$scope.limpaPesquisa = function () {
		$scope.pesquisa = {
			codigo: '',
			codigoBarras : '',
			descricao : ''
		}
	}

	$scope.limpaResultadoPesquisa = function () {
		$scope.resultadoPesquisado = [];
	}

	$scope.limpaCompra = function () {
		$scope.caixa = {
			usuario : usuario.id,
			cliente : cliente.id,
			produtos : [],
			totalItens : 0,
			totalQuantidade : 0,
			desconto : 0,
			valorSubTotal : 0,
			valorDesconto : 0,
			valorVenda : 0.0,
			dataVenda : ''
		}
	}

	$scope.limpaCalculoCaixa = function () {
		$scope.caixa.totalItens = 0;
		$scope.caixa.totalQuantidade = 0;
		$scope.caixa.valorSubTotal = 0;
		$scope.caixa.valorDesconto = 0;
		$scope.caixa.valorVenda = 0;
	}

	$scope.pesquisaProduto = function () {
		$http.post('/produto/pesquisado', $scope.pesquisa)
		.then(
	        function(response){
	        	$scope.resultadoPesquisado = response.data;
	        }, 
	        function(response){
	        	console.log(response);
	        }
	    );
	}

	$scope.adicionarItem = function (itemAdicionado) {
		$scope.limpaPesquisa();
		$scope.limpaResultadoPesquisa();

		var pocisao = $scope.caixa.produtos.indexOf(itemAdicionado);
		if (pocisao > -1) {
			$scope.caixa.produtos[pocisao].quantidade = $scope.caixa.produtos[pocisao].quantidade + 1;
		} else {
			$scope.caixa.produtos.push(itemAdicionado);
		}
		$scope.recalculaCaixa();
	}

	$scope.recalculaCaixa = function () {
		var listaProdutos = $scope.caixa.produtos;
		$scope.limpaCalculoCaixa();
		$scope.caixa.totalItens = listaProdutos.length;
		for (index in listaProdutos) {
			$scope.caixa.totalQuantidade = $scope.caixa.totalQuantidade + listaProdutos[index].quantidade;
			$scope.caixa.valorSubTotal = $scope.caixa.valorSubTotal + (listaProdutos[index].precoUnitario * listaProdutos[index].quantidade);
			$scope.caixa.valorVenda = $scope.caixa.valorVenda + ($scope.itemComDesconto(listaProdutos[index]) * listaProdutos[index].quantidade);
			$scope.caixa.valorDesconto = $scope.caixa.valorSubTotal - $scope.caixa.valorVenda;
		}

	}

	$scope.itemComDesconto = function (item) {
		if ($scope.caixa.desconto === 0) {
			return item.precoUnitario;
		} else {
			return item.precoUnitario - ((item.precoUnitario * $scope.caixa.desconto) / 100);
		}
	}

	$scope.editarItem = function (itemEditado) {
		if (itemEditado.quantidade === 0) {
			$scope.removerItem(itemEditado);
		} else {
			$scope.recalculaCaixa();
		}
	}

	$scope.removerItem = function (itemExcluido) {
		var pocisao = $scope.caixa.produtos.indexOf(itemExcluido);
		if (itemExcluido.quantidade > 1) {
			if (confirm('Você deseja excluir todas quantidades do item '+itemExcluido.descricao+' ?')) {
				$scope.caixa.produtos.splice(pocisao, 1);
				$scope.recalculaCaixa();
				itemExcluido.quantidade = 1;
			}
		} else if (confirm('Você tem certeza que deseja excluir: '+itemExcluido.descricao+' ?')) {
			$scope.caixa.produtos.splice(pocisao, 1);
			$scope.recalculaCaixa();
			itemExcluido.quantidade = 1;
		}
	}

	$scope.gravarCompra = function () {
		console.log($scope.caixa);
	}

}]);