const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Leaders = require('../models/leaders');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

// use chain expression to process request of all leaders
leaderRouter.route('/')
  .get((req, res, next) => { // handle get
    Leaders.find({})
      .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post((req, res, next) => { // handle post
    Leaders.create(req.body)
      .then((leader) => {
        console.log('Leader created', leader);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put((req, res, next) => { // handle put
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
  })
  .delete((req, res, next) => { // handle delete
    Leaders.remove({})
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

// use chain expression to process request of specific leader
leaderRouter.route('/:leaderId')
  .get((req, res, next) => { // handle get
    Leaders.findById(req.params.leaderId)
      .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post((req, res, next) => { // handle post
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/' + req.params.leaderId);
  })
  .put((req, res, next) => { // handle put
    Leaders.findByIdAndUpdate(req.params.leaderId, {
      $set: req.body
    }, { new: true })// return the updated leader
      .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete((req, res, next) => { // handle delete
    Leaders.findByIdAndRemove(req.params.leaderId)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = leaderRouter;
