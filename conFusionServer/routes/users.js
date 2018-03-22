var express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
var User = require('../models/user');

var authenticate = require('../authenticate');

var router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

// sign up
router.post('/signup', (req, res, next) => {
  // passport register function
  User.register(new User({ username: req.body.username }),
    req.body.password, (err, user) => {
      if (err) {
        res.status.code = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      }
      else {
        passport.authenticate('local')(req, res, () => {
          res.status.code = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: 'Registration Successful' });
        });
      }
    })
});

// log in
router.post('/login', passport.authenticate('local'), (req, res) => {

  var token = authenticate.getToken({ _id: req.user._id });

  res.status.code = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({
    success: true,
    token: token,
    status: 'Your are successfully logged in!'
  });
});

// log out
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(); // destory the session from server side
    res.clearCookie('session-id'); // remove cookie from client side
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    return next(err);
  }
})

module.exports = router;
