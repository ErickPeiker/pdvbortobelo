var express = require('express');
//var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.favicon("public/images/favicon.ico"));	

//var config = require(__dirname + '/config/config.json');
var routeCaixa = require('./routes/caixa');
var routeCategoria = require('./routes/categoria');
var routeCliente = require('./routes/cliente');
var routeFornecedor = require('./routes/fornecedor');
var routeProduto = require('./routes/produto');
var routeRelatorio = require('./routes/relatorio');
var routeUsuario = require('./routes/usuario');

//Redireciona para as páginas principais
app.get('/', routeCaixa.inicio);
app.get('/categoria', routeCategoria.inicio);
app.get('/cliente', routeCliente.inicio);
app.get('/fornecedor', routeFornecedor.inicio);
app.get('/produto', routeProduto.inicio);
app.get('/relatorio/vendas', routeRelatorio.vendas);
app.get('/relatorio/compras', routeRelatorio.compras);
app.get('/relatorio/estoque', routeRelatorio.estoque);
app.get('/usuario', routeUsuario.inicio);

//Redireciona para busca de informações
/*app.get('/caixa/todos', routeCaixa.todos);
app.get('/categoria/todos', routeCategoria.todos)
app.get('/cliente/todos', routeCliente.todos);
app.get('/fornecedor/todos', routeFornecedor.todos);
app.get('/produto/todos', routeProduto.todos);
app.get('/relatorio/todos', routeRelatorio.todos);
app.get('/usuario/todos', routeUsuario.todos);*/

http.createServer(app)
.listen(8080, function() {
    console.log('Express server listening on port ' + app.get('port'));
});