var transacao = require("../config/db");

exports.inicio = function(req, res) {
	res.render('cadProduto');
};

exports.salvar = function (req, res, conexao) {
	var objetoListaQuery = [];
	var produto = req.body;

	if (produto.id > 0) {
		/**

		- PRODUTO NÃO PODE ATUALIZAR QUANTIDADE - QUEM FAZ ISSO É COMPRA E VENDA
		- NÃO POSSUI VALOR DE COMPRA - VALOR MÉDIO DE COMPRA NO ULTIMO MÊS OU O ÚLTIMO COMPRADO

		**/
		objetoListaQuery.push({
			conn: conexao,
		    select : 'UPDATE PRODUTO SET Codigo=$2, CodigoBarras=$3, Descricao=$4, IdCategoria=$5, '+
		    			'EstoqueMinimo=$6, Ativo=$7, DataAlteracoes=CURRENT_DATE WHERE Id=$1',
		    params : [
			    produto.id, 
			    produto.codigo, 
			    produto.codigoBarras, 
			    produto.descricao, 
			    produto.categoria,  
			    produto.estoqueMinimo, 
			    produto.ativo
		    ]
		});
	} else {
		objetoListaQuery.push({
			conn: conexao,
		    select : 'INSERT INTO PRODUTO (Codigo, CodigoBarras, Descricao, IdCategoria, EstoqueMinimo, Ativo) '+
		    			'VALUES ($1, $2, $3, $4, $5, $6) ',
		    params : [
			    produto.codigo, 
			    produto.codigoBarras, 
			    produto.descricao, 
			    produto.categoria, 
			    produto.estoqueMinimo, 
			    produto.ativo
		    ]
		});
	}

	transacao.executaTransacao(objetoListaQuery)
	.then(function(resultados){
		res.json(resultados);
	})
	.catch(function(erro){
		res.json(erro);
	});
}

exports.todos = function(req, res, conexao) {
	var objetoListaSelect = [];
	objetoListaSelect.push({
	    conn: conexao,
	    select : 'SELECT * FROM PRODUTO WHERE ativo = $1',
	    params : [1]
	});

	transacao.executaTransacao(objetoListaSelect)
	.then(function(resultados){
		res.json(resultados[0].rows);
	})
	.catch(function(erro){
		res.json(erro);
	});
};

exports.pesquisado = function (req, res, conexao) {
	var pesquisa = req.body;
	var sql = 'SELECT * FROM PRODUTO WHERE ativo = true'
	var parametros = [];
	var aux =1;

	if (pesquisa.codigo) {
		sql += ' AND codigo = $'+aux;
		parametros.push(pesquisa.codigo);
	} else if (pesquisa.codigoBarras){
		sql += ' AND codigobarras = $'+aux;
		parametros.push(pesquisa.codigoBarras);
	} else if (pesquisa.descricao){
		sql += ' AND descricao like $'+aux;
		parametros.push('%'+pesquisa.descricao+'%');
	}

	var objetoListaSelect = [];
	objetoListaSelect.push({
		conn: conexao,
	    select : sql,
	    params : parametros
	});

	transacao.executaTransacao(objetoListaSelect)
	.then(function(resultados){
		res.json(resultados[0].rows);
	})
	.catch(function(erro){
		res.json(erro);
	});
}