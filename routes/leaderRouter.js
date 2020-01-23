const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

const Leaders = require('../models/leaders.js');

leaderRouter
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
    Leaders.find({})
      .then(
        leader => {
          res.json(leader);
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
      Leaders.create(req.body)
        .then(
          leader => {
            console.log('Leader Created: ', leader);
            res.json(leader);
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
      res.setHeader('Content-Type', 'text/plain');
      res.end('PUT operation not supported on /leaders');
    },
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Leaders.remove({})
        .then(
          resp => {
            res.json(resp);
          },
          err => next(err),
        )
        .catch(err => next(err));
    },
  );

leaderRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .route('/:leaderId')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    next();
  })
  .get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then(
        leader => {
          res.json(leader);
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
        'POST operation not supported on /leaders/' + req.params.leaderId,
      );
    },
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Leaders.findByIdAndUpdate(
        req.params.leaderId,
        {
          $set: req.body,
        },
        {new: true},
      )
        .then(
          leader => {
            res.json(leader);
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
      Leaders.findByIdAndDelete(req.params.leaderId)
        .then(
          resp => {
            res.json(resp);
          },
          err => next(err),
        )
        .catch(err => next(err));
    },
  );

module.exports = leaderRouter;
