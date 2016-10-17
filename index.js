var express = require('express');
var path = require('path');
var http = require('http');
var pg = require('pg');

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

app.get('/caixa', function (req, res) {
	routeCaixa.inicio(req, res);
});

app.get('/compra', function (req, res) {
	routeCompra.inicio(req, res);
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
	routeUsuario.login(req, res,  new pg.Client(configBd));
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
	routeCaixa.salvar(req, res, pg, configBd);
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

/**
	RELATÓRIOS
**/
app.get('/relatorio/get-vendas', function (req, res) {
	routeRelatorio.getVendas(req, res,  new pg.Client(configBd));
});
app.get('/relatorio/get-vendas-detalhes', function (req, res) {
	routeRelatorio.getVendasDetalhe(req, res,  new pg.Client(configBd));
});
app.get('/relatorio/get-compras', function (req, res) {
	routeRelatorio.getCompras(req, res,  new pg.Client(configBd));
});
app.get('/relatorio/get-compras-detalhes', function (req, res) {
	routeRelatorio.getComprasDetalhe(req, res,  new pg.Client(configBd));
});
app.get('/relatorio/get-estoque', function (req, res) {
	routeRelatorio.getEstoque(req, res,  new pg.Client(configBd));
});


var port = process.env.PORT || 8080;
http.createServer(app)
.listen(port, function() {
    console.log('Express server listening on port ' + port);
});