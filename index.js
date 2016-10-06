var express = require('express');
var path = require('path');
var http = require('http');

var pg = require('pg');
pg.defaults.ssl = true;

var port = process.env.PORT || 8080;
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

var routeCaixa = require('./routes/caixa');
var routeCompra = require('./routes/compra');
var routeCategoria = require('./routes/categoria');
var routeCliente = require('./routes/cliente');
var routeFornecedor = require('./routes/fornecedor');
var routeProduto = require('./routes/produto');
var routeRelatorio = require('./routes/relatorio');
var routeUsuario = require('./routes/usuario');

//Redireciona para as páginas principais
app.get('/', routeCaixa.inicio);
app.get('/compra', routeCompra.inicio);
app.get('/categoria', routeCategoria.inicio);
app.get('/cliente', routeCliente.inicio);
app.get('/fornecedor', routeFornecedor.inicio);
app.get('/produto', routeProduto.inicio);
app.get('/relatorio/vendas', routeRelatorio.vendas);
app.get('/relatorio/compras', routeRelatorio.compras);
app.get('/relatorio/estoque', routeRelatorio.estoque);
app.get('/usuario', routeUsuario.inicio);


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




http.createServer(app)
.listen(port, function() {
    console.log('Express server listening on port ' + port);
});