var transacao = require("../config/db");

exports.inicio = function(req, res) {
	res.render('caixa');
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


exports.salvar = function (req, res, pg, configBd) {
	var objetoListaQuery = [];
	var venda = req.body;
	objetoListaQuery.push({
		conn: new pg.Client(configBd),
	    select : 'INSERT INTO VENDA (idcliente, idusuario, desconto, precodesconto, precovenda, datavenda) '+
	    			'VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
	    params : [
		    1, 
		    1, 
		    venda.desconto, 
		    venda.valorDesconto, 
		    venda.valorVenda,  
		    new Date()
	    ]
	});

	transacao.executaTransacao(objetoListaQuery)
	.then(function(resultados){
		var objetoListaQueryItens = [];
		var conexao = new pg.Client(configBd);
		for (index in venda.produtos) {
			objetoListaQueryItens.push({
				conn: conexao,
			    select : 'INSERT INTO VENDA_ITEM(idvenda, idproduto, quantidade) VALUES ($1, $2, $3)',
			    params : [
			    	resultados[0].rows[0].id,
				    venda.produtos[index].id,
				    venda.produtos[index].quantidade 
				    
			    ]
			});
			objetoListaQueryItens.push({
				conn: conexao,
			    select : 'UPDATE PRODUTO SET QuantidadeEstoque = QuantidadeEstoque-$2 WHERE ID = $1 ',
			    params : [
				    venda.produtos[index].id,
				    venda.produtos[index].quantidade 
			    ]
			});
		}

		transacao.executaTransacao(objetoListaQueryItens)
		.then(function(resultados){
			res.json(resultados);
		})
		.catch(function(erro){
			res.json(erro);
		});

	})
	.catch(function(erro){
		res.json(erro);
	});
}