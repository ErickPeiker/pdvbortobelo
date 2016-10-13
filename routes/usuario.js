var transacao = require("../config/db");

exports.telaInicial = function(req, res) {
	res.render('login');
};

exports.inicio = function(req, res) {
	res.render('cadUsuario');
};

exports.login = function (req, res, conexao) {
	var objetoListaQuery = [];
	objetoListaQuery.push({
		conn: conexao,
	    select : 'SELECT id, nome FROM USUARIO WHERE ativo = true AND nome = $1 AND senha = $2',
	    params : [
		    req.body.nome, 
		    req.body.senha
	    ]
	});

	transacao.executaTransacao(objetoListaQuery)
	.then(function(resultados){		
		var usuarioLogado = resultados[0].rows[0];
		res.json(usuarioLogado);
	})
	.catch(function(erro){
		res.json({token: ''});
	});
}

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