angular.module('app', [])
.controller('controlador', ['$scope','$http', '$timeout',  function($scope, $http, $timeout) {
	$scope.init = function () {
		$scope.limpaPesquisa();
		$scope.limpaCompra();
		$scope.focoDescricao();
		$scope.limpaAlerts();
		$scope.pesquisaProduto();
	}

	$scope.limpaAlerts = function () {
        $('#alerts').modal('hide');
        $scope.alerts = [];
    }

	$scope.focoDescricao = function () {
		$('#pesquisaDescricao').focus();
	}

	$scope.reset = function () {
		$scope.revisar=false;
		$scope.limpaPesquisa();
		$scope.limpaCompra();
		$scope.limpaCalculoCaixa();
		$scope.focoDescricao();
	}

	$scope.limpaPesquisa = function () {
		$scope.pesquisa = {
			codigo: '',
			codigoBarras : '',
			descricao : '',
			compra: true
		}
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
		$scope.resultadoPesquisado = [];
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

	$scope.adicionarItemComEnter = function () {
		if ($scope.produtosFiltrados[0]) {
			$scope.adicionarItem($scope.produtosFiltrados[0]);
		}
	}

	$scope.adicionarItem = function (itemAdicionado) {
		$scope.limpaPesquisa();
		var itemLista = $scope.possuiNaLista(itemAdicionado);
		if (itemLista) {
			if (itemLista.quantidadeestoque >= itemLista.quantidade + 1) {
				itemLista.quantidade = itemLista.quantidade + 1;
			} else {
				alert('Estoque acabou '+itemAdicionado.quantidadeestoque);
				itemLista.quantidade = itemLista.quantidadeestoque;
			}
		} else {
			if (itemAdicionado.quantidadeestoque >= 1) {
				itemAdicionado.quantidade = 1;
				$scope.caixa.produtos.push(itemAdicionado);
			} else {
				alert('Estoque acabou '+itemAdicionado.quantidadeestoque);
				itemAdicionado.quantidade = itemAdicionado.quantidadeestoque;
			}
		}
		$scope.recalculaCaixa();
		$scope.recalculaEstoque();
		$scope.focoDescricao();
	}

	$scope.possuiNaLista = function (produto) {
		for (index in $scope.caixa.produtos) {
			if ($scope.caixa.produtos[index].id == produto.id) {
				return $scope.caixa.produtos[index];
			}
		}
		return false;
	}

	$scope.recalculaCaixa = function () {
		var listaProdutos = $scope.caixa.produtos;
		$scope.limpaCalculoCaixa();
		$scope.caixa.totalItens = listaProdutos.length;
		for (index in listaProdutos) {
			$scope.caixa.totalQuantidade = $scope.caixa.totalQuantidade + listaProdutos[index].quantidade;
			$scope.caixa.valorSubTotal = $scope.caixa.valorSubTotal + (listaProdutos[index].precounitario * listaProdutos[index].quantidade);

			$scope.caixa.valorVenda = $scope.caixa.valorVenda + ($scope.itemComDesconto(listaProdutos[index]) * listaProdutos[index].quantidade);
			$scope.caixa.valorDesconto = $scope.caixa.valorSubTotal - $scope.caixa.valorVenda;
		}
	}

	$scope.recalculaEstoque = function () {

	}

	$scope.itemComDesconto = function (item) {
		if ($scope.caixa.desconto === 0) {
			return item.precounitario;
		} else {
			return item.precounitario - ((item.precounitario * $scope.caixa.desconto) / 100);
		}
	}

	$scope.editarItem = function (itemEditado) {
		if (itemEditado.quantidade === 0) {
			$scope.removerItem(itemEditado);
		} else {
			if (itemEditado.quantidadeestoque >= itemEditado.quantidade) {
				$scope.recalculaCaixa();
			} else {
				alert('Estoque acabou '+itemEditado.quantidadeestoque);
				itemEditado.quantidade = itemEditado.quantidadeestoque; 
				$scope.recalculaCaixa();
			}
		}
		$scope.recalculaEstoque();
		$scope.focoDescricao();
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
		}  else {
			itemExcluido.quantidade = 1;
		}
		$scope.recalculaEstoque();
		$scope.focoDescricao();
	}

	$scope.gravarCompra = function () {
		$http.post('/caixa/save', $scope.caixa)
		.then(
	        function(response){
	        	$scope.reset();
	        	$scope.alerts.push({
                    tipo: 1,
                    titulo: 'Venda Efetuada',
                    texto: 'Sua venda foi realizada com sucesso'
                });
                $scope.confereAlertas();
	        }, 
	        function(response){
	        	$scope.alerts.push({
                    tipo: 3,
                    titulo: 'Venda Efetuada',
                    texto: 'Ocorreu um problema com a venda - Salve o pedido para digitar após o sistema estabilizar (Contate o administrador)'
                });
                $scope.confereAlertas();
	        }
	    );
		$scope.focoDescricao();
	}

    $scope.confereAlertas = function (){
        $timeout($scope.limpaAlerts, 10000);
        if ( $scope.alerts.length > 0) {
            $('#alerts').modal();
            return false;
        } else {
            return true;
        }
    }

	$scope.cancelar = function () {
		if (confirm('Você deseja cancelar esta compra?')) {
			$scope.reset();
		}
	}

}])
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
});