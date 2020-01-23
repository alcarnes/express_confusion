const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');

const promoRouter = express.Router();
const Promotions = require('../models/promotions.js');
const cors = require('./cors');

promoRouter.use(bodyParser.json());

promoRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .route('/')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    next();
  })
  .get((req, res, next) => {
    Promotions.find({})
      .then(
        promo => {
          res.json(promo);
        },
        err => next(err),
      )
      .catch(err => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotions.create(req.body)
        .then(
          promo => {
            console.log('Promotion Created: ', promo);
            res.json(promo);
          },
          err => next(err),
        )
        .catch(err => next(err));
    },
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'plain/text');
      res.end('PUT operation not supported on /promotions');
    },
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotions.remove({})
        .then(
          resp => {
            res.json(resp);
          },
          err => next(err),
        )
        .catch(err => next(err));
    },
  );

promoRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .route('/:promoId')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    next();
  })
  .get((req, res, next) => {
    Promotions.findById(req.params.promoId)
      .then(
        promo => {
          res.json(promo);
        },
        err => next(err),
      )
      .catch(err => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'text/plain');
      res.end(
        'POST operation not supported on /promotions/' + req.params.promoId,
      );
    },
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotions.findByIdAndUpdate(
        req.params.promoId,
        {
          $set: req.body,
        },
        {new: true},
      )
        .then(
          promo => {
            res.json(promo);
          },
          err => next(err),
        )
        .catch(err => next(err));
    },
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotions.findByIdAndDelete(req.params.promoId)
        .then(
          promo => {
            res.json(promo);
          },
          err => next(err),
        )
        .catch(err => next(err));
    },
  );

module.exports = promoRouter;
