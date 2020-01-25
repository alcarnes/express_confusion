const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

const Favorites = require('../models/favorite.js');

favoriteRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .route('/')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    next();
  })
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
      .populate('user')
      .populate('dishes')
      .then(
        favorite => {
          res.json(favorite);
        },
        err => next(err),
      )
      .catch(err => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
      .then(
        favorites => {
          console.log('Favorite: ', favorites);
          // if favorites exist
          if (favorites === null) {
            console.log('Favorites null, creating favorites');
            //create favorites
            Favorites.create({
              user: req.user._id,
              dishes: req.body,
            }).then(
              favorites => {
                console.log('Favorites created: ', favorites);
                res.json(favorites);
              },
              err => next(err),
            );
          } else {
            console.log('Favorites exists, adding to favorites');
            // add dishes
            for (let i = 0; i < req.body.length; i++) {
              /*console.log("From body: " + typeof req.body[i]._id);
                console.log("From db: " + typeof favorites.dishes[i]._id);*/
              if (favorites.dishes.indexOf(req.body[i]._id) === -1) {
                // Not in existing dishes so add it
                favorites.dishes.push(req.body[i]);
                console.log('Adding to favorites');
                continue;
              }
              console.log('Already in favorites');
            }
            favorites.save().then(
              favorites => {
                console.log('updated favorites: ', favorites);
                res.json(favorites);
              },
              err => next(err),
            );
          }
        },
        err => next(err),
      )
      .catch(err => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('PUT operation not supported on /favorites');
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({})
      .then(
        resp => {
          res.json(resp);
        },
        err => next(err),
      )
      .catch(err => next(err));
  });

favoriteRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .route('/:dishId')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    next();
  })
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log(
      'GET operation not supported on /favorites/' + req.params.dishId,
    );
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('GET operation not supported on /favorites/' + req.params.dishId);
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
      .then(
        favorites => {
          console.log('Favorite: ', favorites);
          // if favorites exist
          if (favorites === null) {
            console.log('Favorites null, creating favorites');
            //create favorites
            Favorites.create({
              user: req.user._id,
              dishes: [{_id: req.params.dishId}],
            }).then(
              favorites => {
                console.log('Favorites created: ', favorites);
                res.json(favorites);
              },
              err => next(err),
            );
          } else {
            console.log('Favorites exists, adding to favorites');
            // add dish to favorites if not already there
            if (favorites.dishes.indexOf(req.body._id) === -1) {
              // Not in existing dishes so add it
              favorites.dishes.push({_id: req.params.dishId});
              console.log('Adding to favorites');
            }
            console.log('Already in favorites');
            favorites.save().then(
              favorites => {
                console.log('updated favorites: ', favorites);
                res.json(favorites);
              },
              err => next(err),
            );
          }
        },
        err => next(err),
      )
      .catch(err => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log(
      'PUT operation not supported on /favorites/' + req.params.dishId,
    );
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('PUT operation not supported on /favorites/' + req.params.dishId);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
      .then(
        favorites => {
          console.log('Favorite: ', favorites);
          // if favorites exist
          if (favorites != null) {
            console.log('Favorites exists');
            // remove dish from favorites if there
            const index = favorites.dishes.indexOf(req.params.dishId);
            if (index != -1) {
              // Not in existing dishes so add it
              favorites.dishes.splice(index, 1);
              console.log('Removing from favorites');
            }
            favorites.save().then(
              favorites => {
                console.log('favorites after removal: ', favorites);
                res.json(favorites);
              },
              err => next(err),
            );
          }
        },
        err => next(err),
      )
      .catch(err => next(err));
  });

module.exports = favoriteRouter;
