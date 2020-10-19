const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
const authenticate = require('../authenticate');

const Favorites = require('../models/favorite');
const Dishes = require('../models/dishes');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        
    Favorites.findOne({user: req.user})
      .populate('user')
      .populate('dishes')
      .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
      }, (err) => next(err))
      .catch((err) => next(err));

  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    
    Favorites.findOne({user: req.user._id})
      .then((favorites) => {
        
        if (favorites !== null) {

          console.log(favorites.dishes);

          req.body.forEach(element => {
            console.log(element._id);
            if(favorites.dishes.indexOf(element._id) == -1) {
              favorites.dishes.push(element._id);
            }
          });

          favorites.save()
            .then((favorite) => {
              Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(favorite);
                });
            }, (err => next(err)))
            .catch((err) => next(err));

        }
        else {

          var fav = new Favorites({user: req.user, dishes: []});
          req.body.forEach(elem => {
            fav.dishes.push(elem._id);
          });

          Favorites.create(fav)
            .then((favorite) => {
              Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(favorite);
                });
            }, (err => next(err)))
            .catch((err) => next(err));

        }

      }, (err) => next(err))
      .catch((err) => next(err));

  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');

  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    Favorites.remove({user: req.user})
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));

  });

favoriteRouter.route('/:dishId')
  .get(cors.cors, (req, res, next) => {
        
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/' + req.params.dishId);

  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

      Dishes.findById(req.params.dishId)
        .then((dish) => {

          if (dish == null) {

            err = new Error('Dish ' + req.params.dishId + ' not found!');
            err.status = 404;
            return next(err);

          } else {

            Favorites.findOne({user: req.user})
              .then((favorites) => {

                if (favorites != null) {

                  if(favorites.dishes.indexOf({_id: req.params.dishId}) != -1) {
                    favorites.dishes.push({_id: req.params.dishId});
                  }
        
                  favorites.save()
                    .then((favorite) => {
                      Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => {
                          res.statusCode = 200;
                          res.setHeader('Content-Type', 'application/json');
                          res.json(favorite);
                        });
                    }, (err => next(err)))
                    .catch((err) => next(err));
        
                }
                else {
        
                  Favorites.create({user: req.user, dishes: [{_id: req.params.dishId}]})
                    .then((favorite) => {
                      Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => {
                          res.statusCode = 200;
                          res.setHeader('Content-Type', 'application/json');
                          res.json(favorite);
                        });
                    }, (err => next(err)))
                    .catch((err) => next(err));
        
                }

              }, (err) => next(err))
              .catch((err) => next(err));

          }

        }, (err) => next(err))
        .catch((err) => next(err));

  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/' + req.params.dishId);

  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

      Favorites.findOne({user: req.user})
      .then((favorites) => {

        var index = favorites.dishes.indexOf(req.params.dishId)
        if (index > -1) {
          favorites.dishes.splice(index, 1);
        }

        favorites.save()
            .then((favorite) => {
              Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(favorite);
                });
            }, (err => next(err)))
            .catch((err) => next(err));

      }, (err) => next(err))
      .catch((err) => next(err));

  });

module.exports = favoriteRouter;
