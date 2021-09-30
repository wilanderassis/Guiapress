const express = require('express');
const { default: slugify } = require('slugify');
const Category = require('./Category');
const router = express.Router();

router.get('/admin/categories/new', (req, res) => {
    res.render('admin/categories/new')
});

/* SALVAR CATEGORIA */
router.post('/categories/save', (req, res) => {
    let title = req.body.title;
    if (title) {
        Category.create(
            {
                title: title,
                slug: slugify(title).toLowerCase()
            }
        )
            .then(() => {
                console.log('Categoria salva com sucesso!');
                res.redirect('/')
            })
    } else {
        res.redirect('/admin/categories/new')
    }
});

/* BUSCA TODAS AS CATEGORIAS */
router.get('/admin/categories', (req, res) => {
    Category.findAll()
        .then((categories) => {
            res.render('admin/categories/index', { categories: categories })
        })
});

/* DELETAR CATEGORIA */
router.post('/categories/delete', (req, res) => {
    let id = req.body.id;
    if (id) {
        if (!isNaN(id)) {
            Category.destroy({
                where: {
                    id: id
                }
            })
                .then(() => {
                    res.redirect('/admin/categories')
                })
        } else {
            res.redirect('/admin/categories')
        }
    } else {
        res.redirect('/admin/categories')
    }
});

module.exports = router;