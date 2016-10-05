var transacao = require("../config/db");

exports.inicio = function(req, res) {
	res.render('cadProduto');
};

exports.salvar = function (req, res, conexao) {
	var objetoListaQuery = [];
	var produto = req.body;

	console.log(produto);

	if (produto.id > 0) {
		//Edição simples do cadastro de produtos
		objetoListaQuery.push({
			conn: conexao,
		    select : 'UPDATE PRODUTO SET Codigo=$2, CodigoBarras=$3, Descricao=$4, IdCategoria=$5, '+
		    			'EstoqueMinimo=$6, Ativo=$7, DataAlteracoes=CURRENT_DATE WHERE Id=$1',
		    params : [
			    produto.id, 
			    produto.codigo, 
			    produto.codigobarras, 
			    produto.descricao, 
			    produto.idcategoria,  
			    produto.estoqueminimo, 
			    produto.ativo
		    ]
		});
	} else if(produto.codigoProduto > 0 && produto.quantidadeEstoque > 0) {
		//Edição de uma compra de produtos
		objetoListaQuery.push({
			conn: conexao,
		    select : 'UPDATE PRODUTO SET IdFornecedor=$2, PrecoCompra=$3, PrecoUnitario=$4, quantidadeEstoque=COALESCE(quantidadeEstoque, 0) + $5, '+
		    			'DataAlteracoes=CURRENT_DATE WHERE Codigo=$1',
		    params : [
			    produto.codigoProduto, 
			    produto.fornecedor, 
			    parseFloat(produto.precoCompra.replace(',', '.')),
			    parseFloat(produto.precoUnitario.replace(',', '.')), 
			    produto.quantidadeEstoque
		    ]
		});
	} else {
		objetoListaQuery.push({
			conn: conexao,
		    select : 'INSERT INTO PRODUTO (Codigo, CodigoBarras, Descricao, IdCategoria, EstoqueMinimo, Ativo) '+
		    			'VALUES ($1, $2, $3, $4, $5, $6) ',
		    params : [
			    produto.codigo, 
			    produto.codigobarras, 
			    produto.descricao, 
			    produto.idcategoria, 
			    produto.estoqueminimo, 
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

exports.getCodigoNovo = function(req, res, conexao) {
	var objetoListaSelect = [];
	objetoListaSelect.push({
	    conn: conexao,
	    select : 'SELECT NEXTVAL($1)',
	    params : ['codigo_produto']
	});

	transacao.executaTransacao(objetoListaSelect)
	.then(function(resultados){
		res.json(resultados[0].rows);
	})
	.catch(function(erro){
		res.json(erro);
	});
};

exports.excluir = function(req, res, conexao) {
	var objetoListaSelect = [];
	objetoListaSelect.push({
	    conn: conexao,
	    select : 'DELETE FROM PRODUTO WHERE ID = $1',
	    params : [req.body.id]
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
		sql += ' AND UPPER(descricao) like $'+aux;
		parametros.push('%'+pesquisa.descricao.toUpperCase()+'%');
	}

	var objetoListaSelect = [];
	objetoListaSelect.push({
		conn: conexao,
	    select : sql,
	    params : parametros
	});

	transacao.executaTransacao(objetoListaSelect)
	.then(function(resultados){
		var lista = resultados[0].rows;
		for (item in lista) {
			lista[item].precocompra = parseFloat(lista[item].precocompra);
			lista[item].precounitario = parseFloat(lista[item].precounitario);
		}
		res.json(lista);
	})
	.catch(function(erro){
		res.json(erro);
	});
}