const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

// use chain expression to process request of all leaders
leaderRouter.route('/')
  .all((req, res, next) => { // handle all request
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text-plain');
    next(); // continue to process and pass the parameters to next request
  }).get((req, res, next) => { // handle get
    res.end('Will send all the leaders to you!');
  }).post((req, res, next) => { // handle post
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
  }).put((req, res, next) => { // handle put
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
  }).delete((req, res, next) => { // handle delete
    res.end('Deleting all the leaders!');
  });

// use chain expression to process request of specific leader
leaderRouter.route('/:leaderId')
  .all((req, res, next) => { // handle all request
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text-plain');
    next(); // continue to process and pass the parameters to next request
  }).get((req, res, next) => { // handle get
    res.end('Will send the leader: ' + req.params.leaderId + ' to you!');
  }).post((req, res, next) => { // handle post
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/' + req.params.leaderId);
  }).put((req, res, next) => { // handle put
    res.write('Updating the leader: ' + req.params.leaderId + '\n');
    res.end('Will update the leader: ' + req.body.name + ' with details: ' + req.body.description);
  }).delete((req, res, next) => { // handle delete
    res.end('Deleting leader: ' + req.params.leaderId);
  });

module.exports = leaderRouter;
