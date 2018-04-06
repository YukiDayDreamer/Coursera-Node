const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// use chain expression to process request of all dishes
dishRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
  .get(cors.cors, (req, res, next) => { // open to all users
    Dishes.find({})
      .populate('comments.author') // populated the author of comment by User 
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { // first verify admin user, then would allows to post
    Dishes.create(req.body)
      .then((dish) => {
        console.log('Dish created', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { // first verify admin user, then would allows to put
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { // first verify admin user, then would allows to delete
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
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
  .get(cors.cors, (req, res, next) => { // handle get
    Dishes.findById(req.params.dishId)
      .populate('comment.author')
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { // handle post
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId);
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { // handle put
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
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { // handle delete
    Dishes.findByIdAndRemove(req.params.dishId)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  });


// use chain expression to process request of all comments of dish
dishRouter.route('/:dishId/comments')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
  .get(cors.cors, (req, res, next) => { // handle get
    Dishes.findById(req.params.dishId)
      .populate('comment.author')
      .then((dish) => {
        if (dish != null) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(dish.comments); // only return comments
        }
        else {
          err = new Error('Dish ' + req.params.dishId + ' not found!');
          err.status = 404;
          return next(err);
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { // handle post
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null) {
          req.body.author = req.user._id; // after user verified, passport will put user info into req.user
          dish.comments.push(req.body);
          dish.save()
            .then((dish) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(dish); // only return comments
            });
        }
        else {
          err = new Error('Dish ' + req.params.dishId + ' not found!');
          err.status = 404;
          return next(err);
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { // handle put
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes'
      + req.params.dishId + '/comments');
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { // handle delete
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null) {
          for (var i = (dish.comments.length - 1); i >= 0; i--) {
            dish.comments.id(dish.comments[i]._id).remove();
          }
          dish.save()
            .then((dish) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(dish); // only return comments
            });
        }
        else {
          err = new Error('Dish ' + req.params.dishId + ' not found!');
          err.status = 404;
          return next(err);
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  });


// use chain expression to process request of specific comment of dish
dishRouter.route('/:dishId/comments/:commentId')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
  .get(cors.cors, (req, res, next) => { // handle get
    Dishes.findById(req.params.dishId)
      .populate('comment.author')
      .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(dish.comments.id(req.params.commentId)); // only specific comment
        }
        else if (dish == null) {
          err = new Error('Dish ' + req.params.dishId + ' not found!');
          err.status = 404;
          return next(err);
        }
        else {
          err = new Error('Comment ' + req.params.commentId + ' not found!');
          err.status = 404;
          return next(err);
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { // handle post
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId
      + '/comments/' + req.params.commentId);
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { // handle put
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
          var commentObj = dish.comments.id(req.params.commentId);
          // verify comment author
          if (!req.user._id.equals(commentObj.author)) {
            err = new Error("You are not authorized to perform this operation!");
            err.status = 403;
            return next(err);
          }
          // only allows to update rating and comments 
          if (req.body.rating) {
            commentObj.rating = req.body.rating;
          }
          if (req.body.comment) {
            commentObj.comment = req.body.comment;
          }
          dish.save()
            .then((dish) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(dish); // only return comments
            });
        }
        else if (dish == null) {
          err = new Error('Dish ' + req.params.dishId + ' not found!');
          err.status = 404;
          return next(err);
        }
        else {
          err = new Error('Comment ' + req.params.commentId + ' not found!');
          err.status = 404;
          return next(err);
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { // handle delete
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
          var commentObj = dish.comments.id(req.params.commentId);
          // verify comment author
          if (!req.user._id.equals(commentObj.author)) {
            err = new Error("You are not authorized to perform this operation!");
            err.status = 403;
            return next(err);
          }
          commentObj.remove();
          dish.save()
            .then((dish) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(dish); // only return comments
            });
        }
        else if (dish == null) {
          err = new Error('Dish ' + req.params.dishId + ' not found!');
          err.status = 404;
          return next(err);
        }
        else {
          err = new Error('Comment ' + req.params.commentId + ' not found!');
          err.status = 404;
          return next(err);
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = dishRouter;
