var transacao = require("../config/db");

exports.inicio = function(req, res) {
	res.render('compra');
};

exports.salvar = function (req, res, conexao) {
	var objetoListaQuery = [];
	var compra = req.body;

	if (compra.precoCompra == '') {
		compra.precoCompra = '0.0';
	}

	objetoListaQuery.push({
		conn: conexao,
	    select : 'INSERT INTO COMPRA (IdUsuario, IdFornecedor, IdProduto, Quantidade, PrecoUnitarioCompra) VALUES ($1, $2, $3, $4, $5)',
	    params : [
		    1, 
		    compra.fornecedor,
		    compra.idProduto,
		    compra.quantidadeEstoque,
		    parseFloat(compra.precoCompra.replace(',', '.')) 
	    ]
	});

	objetoListaQuery.push({
		conn: conexao,
	    select : 'UPDATE PRODUTO SET IdFornecedor=$2, PrecoCompra=$3, PrecoUnitario=$4, quantidadeEstoque=COALESCE(quantidadeEstoque, 0) + $5, '+
	    			'DataAlteracoes=CURRENT_DATE WHERE Id=$1',
	    params : [
		    compra.idProduto, 
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