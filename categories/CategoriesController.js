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
                res.redirect('/admin/categories')
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

/* EDITAR CATEGORIA */
router.get('/admin/categories/edit/:id', (req, res) => {
    let id = req.params.id;

    if (isNaN(id)) {
        res.redirect('/admin/categories');
    }

    Category.findByPk(id)
        .then((category) => {
            if (category) {
                res.render('admin/categories/edit', { category: category })
            } else {
                res.redirect('/admin/categories');
            }
        })
        .catch((error) => {
            res.redirect('/admin/categories');
        });
});

router.post('/categories/update', (req, res) => {
    let id = req.body.id;
    let title = req.body.title;

    Category.update(
        {
            title: title,
            slug: slugify(title).toLowerCase()
        },
        {
            where: {
                id: id
            }
        }
    )
        .then(() => {
            res.redirect('/admin/categories');
        })

});

module.exports = router;