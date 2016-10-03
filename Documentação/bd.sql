CREATE TABLE CATEGORIA (
	Id bigserial primary key,
	Nome varchar(100) not null,
	DataCadastro DATE not null default CURRENT_DATE,
	DataAlteracoes DATE not null default CURRENT_DATE,
	Ativo boolean default true
);

CREATE TABLE FORNECEDOR (
	Id bigserial primary key,
	Nome varchar(100) not null,
	Contato varchar(100) not null,
	Telefone varchar(20),
	Endereco varchar(200) not null,
	Observacoes varchar(500) not null,
	DataCadastro DATE not null default CURRENT_DATE,
	DataAlteracoes DATE not null default CURRENT_DATE,
	Ativo boolean default true
);

CREATE TABLE PRODUTO(
	Id bigserial primary key,
	Codigo INTEGER null,
	CodigoBarras varchar(30) null,
	Descricao varchar(255) null,
	QuantidadeEstoque Integer,
	IdCategoria INTEGER REFERENCES CATEGORIA(Id),
	IdFornecedor INTEGER REFERENCES FORNECEDOR(Id),
	PrecoCompra NUMERIC NULL,
	PrecoUnitario NUMERIC NULL,
	EstoqueMinimo INTEGER NULL,
	DataCadastro DATE not null default CURRENT_DATE,
	DataAlteracoes DATE not null default CURRENT_DATE,
	Ativo boolean default true
);

CREATE TABLE USUARIO (
	Id bigserial primary key,
	Nome varchar(100) not null,
	Senha varchar(50) not null,
	DataCadastro DATE not null default CURRENT_DATE,
	DataAlteracoes DATE not null default CURRENT_DATE,
	Ativo boolean default true
);

CREATE TABLE CLIENTE (
	Id bigserial primary key,
	Nome varchar(100) not null,
	Contato varchar(100) not null,
	Endereco varchar(200) not null,
	Observacoes varchar(500) not null,
	DataCadastro DATE not null default CURRENT_DATE,
	DataAlteracoes DATE not null default CURRENT_DATE,
	Ativo boolean default true
);

CREATE TABLE VENDA (
	Id bigserial primary key,
	IdCliente INTEGER REFERENCES Cliente(Id),
	IdUsuario INTEGER REFERENCES Usuario(Id),
	Desconto Numeric NULL,
	PrecoDesconto Numeric NULL,
	PrecoVenda Numeric NULL,
	DataVenda DATE not null default CURRENT_DATE
);

CREATE TABLE VENDA_ITEM (
	Id bigserial primary key,
	IdVenda INTEGER REFERENCES VENDA(Id),
	IdProduto INTEGER REFERENCES PRODUTO(Id),
	Quantidade INTEGER NOT NULL
);