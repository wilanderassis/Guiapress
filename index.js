/* CONFIGURAÇÃO DO EXPRESS */
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

/* IMPORT DO ARQUIVO DE CONFIGURAÇÕES DO BANCO DE DADOS */
const connection = require('./database/database')

/* IMPORT DOS CONTROLLERS */
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')

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
    Article.findAll({
        order: [['id', 'DESC']],
        limit: 4
    })
        .then((articles) => {
            Category.findAll()
                .then((categories) => {
                    res.render('index', { articles: articles, categories: categories });
                })
        })
});

app.get('/:slug', (req, res) => {
    let slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    })
        .then((article) => {
            if (article != undefined) {
                Category.findAll()
                    .then((categories) => {
                        res.render('article', { article: article, categories: categories });
                    })
            } else {
                res.redirect('/');
            }
        })
        .catch((error) => {
            res.redirect('/');
        })
})

app.get('/category/:slug', (req, res) => {
    let slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{ model: Article }]
    })
        .then((category) => {
            if (category) {
                Category.findAll()
                    .then((categories) => {
                        res.render('index', { articles: category.articles, categories: categories })
                    })
            } else {
                res.redirect('/');
            }
        })
        .catch((error) => {
            res.redirect('/');
        })
})

/* CHAMADA DOS CONTROLLERS */
app.use('/', categoriesController)
app.use('/', articlesController)

/* FUNÇÃO PARA SUBIR O SERVIDOR */
app.listen(3333, () => {
    console.log('Servidor ON!');
})