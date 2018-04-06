const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

// use chain expression to process request of all promos
promoRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
  .get(cors.cors, (req, res, next) => { // open to all users
    Promotions.find({})
      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { // first verify user, then would allows to post
    Promotions.create(req.body)
      .then((promotion) => {
        console.log('Promotion created', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { // first verify user, then would allows to put
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {  // first verify user, then would allows to delete
    Promotions.remove({})
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

// use chain expression to process request of specific promo
promoRouter.route('/:promoId')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
  .get(cors.cors, (req, res, next) => { // handle get
    Promotions.findById(req.params.promoId)
      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { // handle post
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/' + req.params.promoId);
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { // handle put
    Promotions.findByIdAndUpdate(req.params.promoId, {
      $set: req.body
    }, { new: true })// return the updated promo
      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { // handle delete
    Promotions.findByIdAndRemove(req.params.promoId)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = promoRouter;
