/* CONFIGURAÇÃO DO EXPRESS */
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

/* IMPORT DO ARQUIVO DE CONFIGURAÇÕES DO BANCO DE DADOS */
const connection = require('./database/database')

/* IMPORT DOS CONTROLLERS */
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./categories/CategoriesController')

/* IMPORT DOS MODELS */
const Category = require('./categories/Category');
const Article = require('./articles/Article');

/* CONFIGURAÇÃO DA VIEW ENGINE */
app.set('view engine', 'ejs')

/* CONFIGURAÇÃO PARA ARQUIVOS STATICS */
app.use(express.static('public'))

/* CONFIGURAÇÃO DO BODY PARSER */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/* AUTENTICAÇÃO COM O BANCO DE DADOS */
connection.authenticate()
    .then(() => {
        console.log('Conexão feita com sucesso!');
    })
    .catch((error) => {
        console.log('Erro ao conectar com o banco de dados!');
    })

app.get('/', (req, res) => {
    res.render('index');
});

/* CHAMADA DOS CONTROLLERS */
app.use('/', categoriesController)
app.use('/', articlesController)

/* FUNÇÃO PARA SUBIR O SERVIDOR */
app.listen(3333, () => {
    console.log('Servidor ON!');
})