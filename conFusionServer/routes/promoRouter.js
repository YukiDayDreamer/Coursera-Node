const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

// use chain expression to process request of all promoes
promoRouter.route('/')
  .all((req, res, next) => { // handle all request
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text-plain');
    next(); // continue to process and pass the parameters to next request
  }).get((req, res, next) => { // handle get
    res.end('Will send all the promotions to you!');
  }).post((req, res, next) => { // handle post
    res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
  }).put((req, res, next) => { // handle put
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
  }).delete((req, res, next) => { // handle delete
    res.end('Deleting all the promotions!');
  });

// use chain expression to process request of specific dish
promoRouter.route('/:promoId')
  .all((req, res, next) => { // handle all request
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text-plain');
    next(); // continue to process and pass the parameters to next request
  }).get((req, res, next) => { // handle get
    res.end('Will send the promotion: ' + req.params.promoId + ' to you!');
  }).post((req, res, next) => { // handle post
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/' + req.params.promoId);
  }).put((req, res, next) => { // handle put
    res.write('Updating the promotion: ' + req.params.promoId + '\n');
    res.end('Will update the promotion: ' + req.body.name + ' with details: ' + req.body.description);
  }).delete((req, res, next) => { // handle delete
    res.end('Deleting promotion: ' + req.params.promoId);
  });

module.exports = promoRouter;
