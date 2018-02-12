const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// use chain expression to process request
dishRouter.route('/')
  .all((req, res, next) => { // handle all request
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text-plain');
    next(); // continue to process and pass the parameters to next request
  }).get((req, res, next) => { // handle get
    res.end('Will send all the dishes to you!');
  }).post((req, res, next) => { // handle post
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
  }).put((req, res, next) => { // handle put
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
  }).delete((req, res, next) => { // handle delete
    res.end('Deleting all the dishes!');
  });

module.exports = dishRouter;
