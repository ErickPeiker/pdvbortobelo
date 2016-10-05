var transacao = require("../config/db");

exports.inicio = function(req, res) {
	res.render('cadCategoria');
};

exports.salvar = function (req, res, conexao) {
	var objetoListaQuery = [];
	var categoria = req.body;

	if (categoria.id > 0) {
		objetoListaQuery.push({
			conn: conexao,
		    select : 'UPDATE CATEGORIA SET Nome=$2, Ativo=$3, DataAlteracoes=CURRENT_DATE WHERE Id=$1',
		    params : [categoria.id, categoria.nome, categoria.ativo]
		});
	} else {
		objetoListaQuery.push({
			conn: conexao,
		    select : 'INSERT INTO CATEGORIA (Nome, Ativo) VALUES ($1, $2)',
		    params : [categoria.nome, categoria.ativo]
		});
	}

	transacao.executaTransacao(objetoListaQuery)
	.then(function(resultados){
		res.json(resultados);
	})
	.catch(function(erro){
		res.json(erro);
	});
};

exports.excluir = function (req, res, conexao) {
	res.json(req.body);
};

exports.todos = function(req, res, conexao) {
	var objetoListaSelect = [];
	objetoListaSelect.push({
		conn: conexao,
	    select : 'SELECT * FROM CATEGORIA',
	    params : []
	});

	transacao.executaTransacao(objetoListaSelect)
	.then(function(resultados){
		var lista = resultados[0].rows;
		for (item in lista) {
			lista[item].id = parseInt(lista[item].id);
		}
		res.json(lista);
	})
	.catch(function(erro){
		res.json(erro);
	});
};