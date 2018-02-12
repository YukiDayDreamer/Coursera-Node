const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// use chain expression to process request of all dishes
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

// use chain expression to process request of specific dish
dishRouter.route('/:dishId')
  .all((req, res, next) => { // handle all request
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text-plain');
    next(); // continue to process and pass the parameters to next request
  }).get((req, res, next) => { // handle get
    res.end('Will send the dish: ' + req.params.dishId + ' to you!');
  }).post((req, res, next) => { // handle post
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId);
  }).put((req, res, next) => { // handle put
    res.write('Updating the dish: ' + req.params.dishId + '\n');
    res.end('Will update the dish: ' + req.body.name + ' with details: ' + req.body.description);
  }).delete((req, res, next) => { // handle delete
    res.end('Deleting dish: ' + req.params.dishId);
  });

module.exports = dishRouter;
