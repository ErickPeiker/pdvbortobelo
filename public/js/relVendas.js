angular.module('app', [])
.controller('controlador', function($scope, $http) {

	$scope.init = function () {
		var dataBase = new Date();
		var inicio = new Date(dataBase.getFullYear(),
                         		dataBase.getMonth() -1,
                         		dataBase.getDate());
		var final = dataBase;

		$http.get('/relatorio/get-vendas?inicio='+inicio.toISOString()+'&fim='+final.toISOString())
		.success(function(response){
                var itensRetorno = response[0].rows;
                $scope.listaDiaCompleta = itensRetorno;    
            })
		.error(function(response){
            console.log(response);
        });
	}

	$scope.detalhes = function (dia) {
		$http.get('/relatorio/get-vendas-detalhes?dia='+dia)
		.success(function(response){
            var itensRetorno = response[0].rows;
			$scope.listaVendasCompleta = [];
			$scope.vendas = [];

            for (index in itensRetorno) {
            	/**
					Variáveis calculadas
            	**/
            	if (isNaN(itensRetorno[index].precocompra)){
            		itensRetorno[index].precocompra = 0.0;
            	}
                var valorCompraPorItem = itensRetorno[index].precocompra * itensRetorno[index].quantidade;
            	var valorVendaPorItem = (itensRetorno[index].precounitario - 
            								(itensRetorno[index].precounitario * (itensRetorno[index].percentual/100)))
            								* itensRetorno[index].quantidade;
            	var lucroPorItem = ((itensRetorno[index].precounitario - 
            									(itensRetorno[index].precounitario * (itensRetorno[index].percentual/100))) 
            									- itensRetorno[index].precocompra) * itensRetorno[index].quantidade;
            	
            	/**
					Novas variáveis no item para não ocorrer databinding
            	**/
            	var produtoAtual = {
					item : itensRetorno[index].item,
					quantidade : itensRetorno[index].quantidade,
					categoria : itensRetorno[index].categoria,
					valorVenda : valorVendaPorItem,
					valorCompra : valorCompraPorItem,
					valorLucro : lucroPorItem
				}

            	/**
					Agrupamento por vendas
            	**/
            	if ($scope.vendas.indexOf(itensRetorno[index].venda) > -1) {
            		vendaAtual.valorVenda += valorVendaPorItem;
					vendaAtual.desconto += itensRetorno[index].desconto;
					vendaAtual.itensVendidos += itensRetorno[index].quantidade;
					vendaAtual.valorCompra += parseFloat(valorCompraPorItem);
					vendaAtual.valorLucro += lucroPorItem;
					vendaAtual.produtos.push(produtoAtual);
            	} else {
            		if ($scope.vendas.length != 0) {
            			$scope.listaVendasCompleta.push(vendaAtual);
            		}
            		var vendaAtual = {produtos:[]};

            		$scope.vendas.push(itensRetorno[index].venda);
            		vendaAtual.id = itensRetorno[index].venda;
					vendaAtual.valorVenda = valorVendaPorItem;
					vendaAtual.percentual = itensRetorno[index].percentual;
					vendaAtual.desconto = itensRetorno[index].desconto;
					vendaAtual.itensVendidos = itensRetorno[index].quantidade;
					vendaAtual.valorCompra = parseFloat(valorCompraPorItem);
					vendaAtual.valorLucro = lucroPorItem;
					vendaAtual.quantidade = itensRetorno[index].quantidade;
					vendaAtual.produtos.push(produtoAtual);
            	}
            }
            $scope.listaVendasCompleta.push(vendaAtual);   
            $('#resultadoDetalhes').modal();
        })
		.error(function(response){
            console.log(response);
        });
	}


})
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