const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// use chain expression to process request of all dishes
dishRouter.route('/')
  .get((req, res, next) => { // handle get
    Dishes.find({})
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post((req, res, next) => { // handle post
    Dishes.create(req.body)
      .then((dish) => {
        console.log('Dish created', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put((req, res, next) => { // handle put
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
  })
  .delete((req, res, next) => { // handle delete
    Dishes.remove({})
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

// use chain expression to process request of specific dish
dishRouter.route('/:dishId')
  .get((req, res, next) => { // handle get
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post((req, res, next) => { // handle post
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId);
  })
  .put((req, res, next) => { // handle put
    Dishes.findByIdAndUpdate(req.params.dishId, {
      $set: req.body
    }, { new: true })// return the updated dish
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete((req, res, next) => { // handle delete
    Dishes.findByIdAndRemove(req.params.dishId)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = dishRouter;
