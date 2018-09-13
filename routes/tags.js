'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.post('/', (req, res, next) => {
  const { name } = req.body;

  /***** Never trust users. Validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newItem = { name };

  knex.insert(newItem)
    .into('tags')
    .returning(['id', 'name'])
    .then((results) => {
      const result = results[0];
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

router.get('/', (req, res, next) => {
  knex
    .select()
    .from('tags')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  knex
    .select()
    .from('tags')
    .where({id})
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});
module.exports = router;
