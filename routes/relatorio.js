var transacao = require("../config/db");

exports.compras = function(req, res) {
	res.render('relCompras');
};

exports.vendas = function(req, res) {
	res.render('relVendas');
};

exports.estoque = function(req, res) {
	res.render('relEstoque');
};

exports.todos = function(req, res) {
	var objetoListaSelect = [];
	objetoListaSelect.push({
	    select : 'SELECT NOME  FROM GRUPO WHERE ID = $1',
	    params : [1]
	});

	transacao.executaTransacao(objetoListaSelect)
	.then(function(resultados){
		res.json(resultados);
	})
	.catch(function(erro){
		res.json(erro);
	});
};