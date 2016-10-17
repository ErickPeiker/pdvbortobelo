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
				' GROUP BY V.DATAVENDA '+
				' ORDER BY DIA DESC '

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
				+' ORDER BY DIA DESC, VENDA DESC, PRECO DESC, PRECOUNITARIO DESC'

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

exports.getCompras = function(req, res, conexao) {
	var objetoListaSelect = [];
	var data1 = req.query.inicio.substring(0, req.query.inicio.indexOf('T'));
	var data2 = req.query.fim.substring(0, req.query.fim.indexOf('T'));

	var select = 'SELECT C.datacompra AS DIA, COUNT(DISTINCT C.ID) AS COMPRAS, '+
					'	SUM(C.precounitariocompra * C.quantidade) as VALOR_COMPRA '+
					'FROM COMPRA C '+
					'WHERE C.datacompra >= $1 AND  C.datacompra <= $2 '+
					'GROUP BY C.datacompra '+
					'ORDER BY DIA DESC '

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

exports.getComprasDetalhe = function(req, res, conexao) {
	var objetoListaSelect = [];
	var data = req.query.dia.substring(0, req.query.dia.indexOf('T'));
	var select = 'SELECT C.id AS COMPRA, '+
				'	C.quantidade AS QUANTIDADE, '+
				'	C.precounitariocompra AS PRECO_UNIT, '+
				'	P.id AS PRODUTO, P.DESCRICAO AS ITEM, CAT.NOME AS CATEGORIA, '+
				'	F.nome AS FORNECEDOR '+
				'FROM COMPRA C '+
				'INNER JOIN PRODUTO P '+
				' 	ON C.IDPRODUTO = P.ID '+
				'INNER JOIN CATEGORIA CAT '+
				' 	ON P.IDCATEGORIA = CAT.ID '+
				'INNER JOIN FORNECEDOR F '+
				'	ON C.idfornecedor = F.id '+
				'WHERE C.datacompra >= $1 AND  C.datacompra <= $2 '+
				'ORDER BY C.id, P.id'

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


exports.getEstoque = function(req, res, conexao) {
	var objetoListaSelect = [];
	var select = 'SELECT codigo, descricao, quantidadeestoque as estoque, estoqueminimo as minimo, precocompra as preco_compra, precounitario as preco_venda  '+
					'FROM PRODUTO '+
					'WHERE ativo = true '+
					'ORDER BY descricao ';

	objetoListaSelect.push({
	    conn: conexao,
	    select : select,
	    params : []
	});

	transacao.executaTransacao(objetoListaSelect)
	.then(function(resultados){
		res.json(resultados);
	})
	.catch(function(erro){
		res.json(erro);
	});
};