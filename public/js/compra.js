angular.module('app', [])
.controller('controlador', ['$scope','$http',  function($scope, $http) {
    $scope.init = function () {
        $scope.limpaPesquisa();
        $scope.limpaResultadoPesquisa();
        $scope.getFornecedores();
        $scope.compra = {
            codigoProduto: '',
            descricaoProduto: '',
            fornecedor: '',
            precoCompra: '',
            precoUnitario: '',
            quantidadeEstoque: ''
        }
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
        $scope.compra.codigoProduto = itemCompra.codigo;
        $scope.compra.descricaoProduto = itemCompra.descricao;
    }

    $scope.pesquisaProduto = function () {
        $http.post('/produto/pesquisado', $scope.pesquisa)
        .then(
            function(response){
                $scope.resultadoPesquisado = response.data;
                if ($scope.resultadoPesquisado.length > 0) {
                    $('#resultadoPodutos').modal();
                } else {
                    alert('Não foi encontrado nenhum produto com essa pesquisa');
                }
            }, 
            function(response){
                console.log(response);
            }
        );
    }

    $scope.gravar = function () {

    }

    $scope.cancelar = function () {

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