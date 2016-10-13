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

exports.getVendas = function(req, res, conexao) {
	var objetoListaSelect = [];
	var data1 = req.query.inicio.substring(0, req.query.inicio.indexOf('T'));
	var data2 = req.query.fim.substring(0, req.query.fim.indexOf('T'));
	var select = 'SELECT V.DATAVENDA AS DIA, COUNT(DISTINCT V.ID) AS VENDA, '+
				'	SUM((P.PRECOUNITARIO - (P.PRECOUNITARIO * (V.DESCONTO/100))) * VI.QUANTIDADE) AS VALOR_VENDA, '+
				'	SUM(((P.PRECOUNITARIO - (P.PRECOUNITARIO * (V.DESCONTO/100))) - P.PRECOCOMPRA) * VI.QUANTIDADE) AS DESCONTO '+
				' FROM VENDA V '+
				' INNER JOIN VENDA_ITEM VI '+
				'	ON V.ID = VI.IDVENDA '+
				' INNER JOIN PRODUTO P '+
				'	ON VI.IDPRODUTO = P.ID '+
				' WHERE V.DATAVENDA >= $1 AND  V.DATAVENDA <= $2 '+
				' GROUP BY V.DATAVENDA '

	objetoListaSelect.push({
		conn: conexao,
	    select : select,
	    params : [data1, data2]
	});

	transacao.executaTransacao(objetoListaSelect)
	.then(function(resultados){
		res.json(resultados);
	})
	.catch(function(erro){
		res.json(erro);
	});
};

exports.getVendasDetalhe = function(req, res, conexao) {
	var data = req.query.dia.substring(0, req.query.dia.indexOf('T'));
	var objetoListaSelect = [];
	var select = 'SELECT V.DATAVENDA AS DIA, V.ID AS VENDA, V.PRECOVENDA AS PRECO, '
				+' V.PRECODESCONTO AS DESCONTO, V.DESCONTO AS PERCENTUAL,'
				+' P.ID AS PRODUTO, P.DESCRICAO AS ITEM, C.NOME AS CATEGORIA, VI.QUANTIDADE,'
				+' P.PRECOUNITARIO AS PRECOUNITARIO, P.PRECOCOMPRA AS PRECOCOMPRA'
				+' FROM VENDA V'
				+' INNER JOIN VENDA_ITEM VI'
				+' 	ON V.ID = VI.IDVENDA'
				+' INNER JOIN PRODUTO P'
				+' 	ON VI.IDPRODUTO = P.ID'
				+' INNER JOIN CATEGORIA C'
				+' 	ON P.IDCATEGORIA = C.ID'
				+' WHERE V.DATAVENDA >= $1 AND  V.DATAVENDA <= $2 '
				+' ORDER BY DIA DESC, VENDA DESC, PRECO DESC, PRECOUNITARIO DESC;'

	objetoListaSelect.push({
		conn: conexao,
	    select : select,
	    params : [data, data]
	});

	transacao.executaTransacao(objetoListaSelect)
	.then(function(resultados){
		res.json(resultados);
	})
	.catch(function(erro){
		res.json(erro);
	});
};

exports.getCompras = function(req, res) {
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

exports.getEstoque = function(req, res) {
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