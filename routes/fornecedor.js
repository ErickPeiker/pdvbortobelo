var transacao = require("../config/db");

exports.inicio = function(req, res) {
	res.render('cadFornecedor');
};

exports.salvar = function (req, res, conexao) {
	var objetoListaQuery = [];
	var fornecedor = req.body;

	if (fornecedor.id > 0) {
		objetoListaQuery.push({
			conn: conexao,
		    select : 'UPDATE FORNECEDOR SET Nome=$2, Contato=$3, Telefone=$4, Endereco=$5, Observacoes=$6, Ativo=$7, DataAlteracoes=CURRENT_DATE WHERE Id=$1',
		    params : [fornecedor.id, fornecedor.nome, fornecedor.contato, fornecedor.telefone, fornecedor.endereco, fornecedor.observacoes, fornecedor.ativo]
		});
	} else {
		objetoListaQuery.push({
			conn: conexao,
		    select : 'INSERT INTO FORNECEDOR (Nome, Contato, Telefone, Endereco, Observacoes, Ativo) VALUES ($1, $2, $3, $4, $5, $6)',
		    params : [fornecedor.nome, fornecedor.contato, fornecedor.telefone, fornecedor.endereco, fornecedor.observacoes, fornecedor.ativo]
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
	    select : 'SELECT * FROM FORNECEDOR',
	    params : []
	});

	transacao.executaTransacao(objetoListaSelect)
	.then(function(resultados){
		res.json(resultados[0].rows);
	})
	.catch(function(erro){
		res.json(erro);
	});
};