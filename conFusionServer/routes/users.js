var express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
var User = require('../models/user');
const cors = require('./cors');

var authenticate = require('../authenticate');

var router = express.Router();

router.use(bodyParser.json());

// allow user to get options
router.options('*', cors.corsWithOptions, (req, res) => {
  res.sendStatus(200);
})

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  // only admin can process into this function
  console.log(req.user); // only print the admin user
  User.find({})
    .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(user);
    }, (err) => next(err))
    .catch((err) => next(err));
});

// sign up
router.post('/signup', cors.corsWithOptions, (req, res, next) => {
  // passport register function
  User.register(new User({
      username: req.body.username
    }),
    req.body.password, (err, user) => {
      if (err) {
        res.status.code = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          err: err
        });
      } else {
        // if firstname or lastname is set, save them as well
        if (req.body.firstname)
          user.firstname = req.body.firstname;
        if (req.body.lastname)
          user.lastname = req.body.lastname;
        user.save((err, user) => {
          if (err) {
            res.status.code = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({
              err: err
            });
          }
          passport.authenticate('local')(req, res, () => {
            res.status.code = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
              success: true,
              status: 'Registration Successful'
            });
          });
        });
      }
    })
});

// log in
router.post('/login', cors.corsWithOptions, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success: false,
        status: 'Login Unsuccessful!',
        err: info
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: false,
          status: 'Login Unsuccessful!',
          err: 'Could not log in user!'
        });
      }
      var token = authenticate.getToken({
        _id: req.user._id
      });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success: true,
        status: 'Login Successful!',
        token: token
      });
    });
  })(req, res, next);
});

// log out
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(); // destory the session from server side
    res.clearCookie('session-id'); // remove cookie from client side
    res.redirect('/');
  } else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    return next(err);
  }
});

// facebook login
router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({
      _id: req.user._id
    });
    res.status.code = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: true,
      token: token,
      status: 'Your are successfully logged in!'
    });
  }
});

// check jwt token
router.get('/checkJWTToken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', {
    session: false
  }, (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({
        status: 'JWT invalid!',
        success: false,
        err: info
      });
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({
        status: 'JWT valid!',
        success: true,
        user: user
      });
    }
  })(req, res);
});

module.exports = router;