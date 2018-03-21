var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');

var router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

// sign up
router.post('/signup', (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user != null) {
        var err = new Error('User ' + req.body.username + ' already existed');
        err.status = 403;
        next(err);
      }
      else {
        return User.create({
          username: req.body.username,
          password: req.body.password
        })
      }
    })
    .then((user) => {
      res.status.code = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ status: 'Registration Successful', user: user });
    }, (err) => next(err))
    .catch((err) => next(err));
});

// log in
router.post('/login', (req, res, next) => {
  if (!req.session.user) {
    var authHeader = req.headers.authorization;

    if (!authHeader) {
      var err = new Error('You are not authenicated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
      return;
    }

    var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':'); // an array of two string
    var username = auth[0];
    var password = auth[1];

    User.findOne({ username: username })
      .then((user) => {
        // validate login pairs
        if (user.username === username && user.password === password) {
          req.session.user = 'authenticated';
          res.status.code = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end('You are authenticated!');
        }
        else if (user.password !== password) {
          var err = new Error('Your password is incorrect!');
          err.status = 401;
          return next(err);
        }
        else if (user === null) {
          var err = new Error('User ' + username + ' does not exist!');
          err.status = 401;
          return next(err);
        }
      })
      .catch((err) => next(err));

  }
  else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }
})

// log out
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(); // destory the session from server side
    res.clearCookie('session-id'); // remove cookie from client side
    res.redirect('/');
  }
  else{
    var err = new Error('You are not logged in!');
    err.status = 403;
    return next(err);
  }
})

module.exports = router;
