var express = require('express');
var path = require('path');
var http = require('http');
var pg = require('pg');
var jwt = require('jsonwebtoken');

pg.defaults.ssl = true;

var configBd = require('./config/db').config;
if (!configBd.password) {
	configBd.password = process.env.configBD_password;
}

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//Nova função para gerenciar tokens
app.use(function(req, res, next) {
res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

var routeCaixa = require('./routes/caixa');
var routeCompra = require('./routes/compra');
var routeCategoria = require('./routes/categoria');
var routeCliente = require('./routes/cliente');
var routeFornecedor = require('./routes/fornecedor');
var routeProduto = require('./routes/produto');
var routeRelatorio = require('./routes/relatorio');
var routeUsuario = require('./routes/usuario');

//Redireciona para as páginas principais
app.get('/', function (req, res) {
	routeUsuario.telaInicial(req, res);
});

app.get('/caixa', autenticar, function (req, res) {
	jwt.verify(req.query.token, 'senhateste', function(err, decoded) {
	    if (err) {
	        return false;
	    } else {
	        if (decoded == req.query.id) {
	            routeCaixa.inicio(req, res);
	        } else {
	            return false;
	        }
	    }
	});
});

function autenticar(req, res, next){
	var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
}

app.get('/compra', function (req, res) {
	jwt.verify(req.query.token, 'senhateste', function(err, decoded) {
	    if (err) {
	        return false;
	    } else {
	        if (decoded == req.query.id) {
	            routeCompra.inicio(req, res);
	        } else {
	            return false;
	        }
	    }
	});
});

app.get('/categoria', function (req, res) {
	routeCategoria.inicio(req, res);
});

app.get('/cliente', routeCliente.inicio);
app.get('/fornecedor', routeFornecedor.inicio);
app.get('/produto', routeProduto.inicio);
app.get('/relatorio/vendas', routeRelatorio.vendas);
app.get('/relatorio/compras', routeRelatorio.compras);
app.get('/relatorio/estoque', routeRelatorio.estoque);
app.get('/usuario', routeUsuario.inicio);





app.post('/login', function (req, res) {
	routeUsuario.login(req, res,  new pg.Client(configBd), jwt);
});

app.post('/categoria/save', function (req, res) {
	routeCategoria.salvar(req, res,  new pg.Client(configBd));
});
app.post('/categoria/excluir', function (req, res) {
	routeCategoria.excluir(req, res,  new pg.Client(configBd));
});
app.post('/fornecedor/save', function (req, res) {
	routeFornecedor.salvar(req, res,  new pg.Client(configBd));
});
app.post('/produto/save', function (req, res) {
	routeProduto.salvar(req, res,  new pg.Client(configBd));
});
app.get('/produto/todos', function (req, res) {
	routeProduto.todos(req, res,  new pg.Client(configBd));
});
app.get('/produto/codigo', function (req, res) {
	routeProduto.getCodigoNovo(req, res,  new pg.Client(configBd));
});
app.post('/produto/excluir', function (req, res) {
	routeProduto.excluir(req, res,  new pg.Client(configBd));
});
app.post('/compra/save', function (req, res) {
	routeCompra.salvar(req, res,  new pg.Client(configBd));
});
app.post('/caixa/save', function (req, res) {
	routeCaixa.salvar(req, res,  new pg.Client(configBd));
});
app.get('/categoria/todos', function (req, res) {
	routeCategoria.todos(req, res,  new pg.Client(configBd));
});
app.get('/fornecedor/todos', function (req, res) {
	routeFornecedor.todos(req, res,  new pg.Client(configBd));
});
app.post('/produto/pesquisado', function (req, res) {
	routeProduto.pesquisado(req, res,  new pg.Client(configBd));
});

//Impressão de erro caso o serviço parar por algum motivo
process.on('uncaughtException', function(err) {
	console.log(err);
});


var port = process.env.PORT || 8080;
http.createServer(app)
.listen(port, function() {
    console.log('Express server listening on port ' + port);
});