angular.module('app', [])
.controller('controlador', ['$scope','$http', '$timeout',  function($scope, $http, $timeout) {
    $scope.init = function () {
        $('[data-toggle="popover"]').popover();
        $scope.limpaPesquisa();
        $scope.limpaResultadoPesquisa();
        $scope.getFornecedores();
        $scope.limpaAlerts();
        $scope.limpaCompra();        
    }

    $scope.reset = function () {
        $scope.limpaCompra();
        $scope.limpaPesquisa();
    }

    $scope.limpaCompra = function () {
        $scope.compra = {
            idProduto : 0,
            codigoProduto: '',
            descricaoProduto: '',
            fornecedor: '',
            precoCompra: '',
            precoUnitario: '',
            quantidadeEstoque: 0
        }
    }

    $scope.limpaAlerts = function () {
        $('#alerts').modal('hide');
        $scope.alerts = [];
    }

    $scope.limpaPesquisa = function () {
        $scope.pesquisa = {
            codigo: '',
            codigobarras : '',
            descricao : ''
        }
    }

    $scope.limpaResultadoPesquisa = function () {
        $scope.resultadoPesquisado = [];
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

    $scope.adicionarItem = function (itemCompra) {
        $('#resultadoPodutos').modal('hide');
        $scope.pesquisa.codigo = itemCompra.codigo;
        $scope.pesquisa.descricao = itemCompra.descricao;
        $scope.compra.idProduto = itemCompra.id;
        $scope.compra.codigoProduto = itemCompra.codigo;
        $scope.compra.descricaoProduto = itemCompra.descricao;
    }

    $scope.pesquisaProduto = function () {
        $http.post('/produto/pesquisado', $scope.pesquisa)
        .then(
            function(response){
                $('#resultadoPodutos').modal();
                $scope.resultadoPesquisado = response.data;
                if ($scope.resultadoPesquisado.length == 0) {
                    alert('Não foi encontrado nenhum produto com essa pesquisa');
                    $('#resultadoPodutos').modal('hide');
                }
            }, 
            function(response){
                console.log(response);
            }
        );
    }

    $scope.valida = function () {
        if ($scope.compra.idProduto == 0) {
            $scope.alerts.push({
                tipo: 3,
                titulo: 'Código',
                texto: 'Código do produto precisa ser informado'
            });
        }
        if ($scope.compra.fornecedor.length == 0) {
            $scope.alerts.push({
                tipo: 3,
                titulo: 'Fornecedor',
                texto: 'Informe quem foi o fornecedor'
            });
        }
        /*if ($scope.compra.precoCompra.length == 0) {
            $scope.alerts.push({
                tipo: 3,
                titulo: 'Valor de Compra',
                texto: 'Qual o valor que foi gasto para compra de cada unidade'
            });
        }*/
        if ($scope.compra.precoUnitario.length == 0) {
            $scope.alerts.push({
                tipo: 3,
                titulo: 'Valor de Venda',
                texto: 'Informe o preço que será vendido o produto'
            });
        } 
        if ($scope.compra.quantidadeEstoque == null || $scope.compra.quantidadeEstoque == 0) {
            $scope.alerts.push({
                tipo: 3,
                titulo: 'Quantidade Comprada',
                texto: 'Informe a quantidade do produto foi comprada'
            });
        }

        return $scope.confereAlertas();
    }

    $scope.salvar = function () {
        $scope.limpaAlerts();
        if ($scope.valida()) {
            $http.post('/compra/save', $scope.compra)
            .then(
                function(response){
                    $scope.reset();
                    $scope.alerts.push({
                        tipo: 1,
                        titulo: 'Compra Efetuada',
                        texto: 'Sua compra foi realizada com sucesso'
                    });
                    $scope.confereAlertas();
                }, 
                function(response){
                    console.log(response);
                    $scope.alerts.push({
                        tipo: 3,
                        titulo: 'Compra',
                        texto: 'Ocorreu um problema com sua compra - Entre em contato com a administração do site!'
                    });
                    $scope.confereAlertas();
                }
            );
        }
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
        if (confirm('Deseja limpar a tela?')) {
            $scope.reset();
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