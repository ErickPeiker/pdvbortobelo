var transacao = require("../config/db");

exports.inicio = function(req, res) {
	res.render('compra');
};

exports.salvar = function (req, res, conexao) {
	var objetoListaQuery = [];
	var compra = req.body;

	objetoListaQuery.push({
		conn: conexao,
	    select : 'INSERT INTO COMPRA (IdUsuario, IdFornecedor, dProduto, Quantidade, PrecoUnitarioCompra) VALUES ($1, $2, $3, $4, $5)',
	    params : [
		    1, 
		    compra.fornecedor,
		    compra.codigoProduto,
		    compra.quantidadeEstoque,
		    parseFloat(compra.precoCompra.replace(',', '.')) 
	    ]
	});

	//Edição de uma compra de produtos
	objetoListaQuery.push({
		conn: conexao,
	    select : 'UPDATE PRODUTO SET IdFornecedor=$2, PrecoCompra=$3, PrecoUnitario=$4, quantidadeEstoque=COALESCE(quantidadeEstoque, 0) + $5, '+
	    			'DataAlteracoes=CURRENT_DATE WHERE Codigo=$1',
	    params : [
		    compra.codigoProduto, 
		    compra.fornecedor, 
		    parseFloat(compra.precoCompra.replace(',', '.')),
		    parseFloat(compra.precoUnitario.replace(',', '.')), 
		    compra.quantidadeEstoque
	    ]
	});

	transacao.executaTransacao(objetoListaQuery)
	.then(function(resultados){
		res.json(resultados);
	})
	.catch(function(erro){
		res.json(erro);
	});
}