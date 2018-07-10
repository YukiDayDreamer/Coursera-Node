const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
  })
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({
        user: req.user._id
      })
      .populate('user')
      .populate('dishes')
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  // when user post a list of objectIds
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({
      user: req.user._id
    }).then((favorite) => {
      if (favorite == null) {
        // favorite not existed
        let dishIds = req.body.map(el => el._id);
        Favorites.create({
            user: req.user._id,
            dishes: dishIds
          }).then((favorite) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
          }, (err) => next(err))
          .catch((err) => next(err));
      } else {
        // favorite existed
        req.body.forEach((el) => {
          // check dish id not in the list
          if (favorite.dishes.map(dishId => String(dishId)).indexOf(el._id) == -1) {
            favorite.dishes.push(el._id);
          }
        });
        favorite.save()
          .then((favorite) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
          });
      }
    });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndRemove({
        user: req.user._id
      }).then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

favoriteRouter.route('/:dishId')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
  })
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({
        user: req.user._id
      })
      .then((favorites) => {
        if (!favorites) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          return res.json({
            "exists": false,
            "favorites": favorites
          });
        } else {
          if (favorites.dishes.indexOf(req.params.dishId) < 0) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({
              "exists": false,
              "favorites": favorites
            });
          } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({
              "exists": true,
              "favorites": favorites
            });
          }
        }
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({
        user: req.user._id
      }).then((favorite) => {
        if (favorite == null) {
          // favorite not existed
          Favorites.create({
              user: req.user._id,
              dishes: [req.params.dishId]
            }).then((favorite) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
        } else {
          // favorite existed
          // check dish id not in the list
          if (favorite.dishes.map(dishId => String(dishId)).indexOf(req.params.dishId) == -1) {
            favorite.dishes.push(req.params.dishId);
          }
          favorite.save()
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            });
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/' + req.params.dishId);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({
        user: req.user._id
      }).then((favorite) => {
        if (favorite == null || favorite.dishes.map(dishId => String(dishId)).indexOf(req.params.dishId) == -1) {
          // favorite not existed or dish id not in the list       
          res.statusCode = 403;
          res.end('DELETE operation cannot be processed because no such dish in the favorite list');
        } else {
          favorite.dishes = favorite.dishes.map(dishId => String(dishId)).filter((dishId) => {
            return dishId !== req.params.dishId; // dishId is an object
          });
          favorite.save()
            .then((favorite) => {
              Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                  console.log('Favorite Dish Deleted!', favorite);
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(favorite);
                })
            })
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;