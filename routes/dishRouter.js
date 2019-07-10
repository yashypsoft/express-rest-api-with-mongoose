var express = require("express");
var dishRouter = express.Router();
const mongoose = require("mongoose");
const bodyParsher = require("body-parser");

const Dishes = require("../models/dishes");

dishRouter
  .route("/")

  .get(function(req, res, next) {
    Dishes.find({})
      .then(
        dishes => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dishes);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })

  .post(function(req, res, next) {
    Dishes.create(req.body)
      .then(
        dish => {
          console.log("dish Created", dish);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .put((req,res,next) =>{
        res.statusCode = 403;
          res.end('put operation not supported on Dishes')
  })
  .delete(function(req, res, next) {
    Dishes.remove({})
      .then(
        resp => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        err => next(err)
      )
      .catch(err => next(err));
  });

dishRouter
  .route("/:dishId")
  .get(function(req, res, next) {
    Dishes.findById(req.params.dishId)
      .then(
        dish => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .post(
    (req,
    res,
    next )=> {
      res.statusCode = 403;
      res.end("POST operation not supported on /dishes/" + req.params.dishId);
    }
  )

  .put(function(req, res, next) {
    Dishes.findByIdAndUpdate(
      req.params.dishId,
      {
        $set: req.body
      },
      { new: true }
    )
      .then(
        dish => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })

  .delete(function(req, res, next) {
    Dishes.findByIdAndRemove(req.params.dishId)
      .then(
        resp => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        err => next(err)
      )
      .catch(err => next(err));
  });

module.exports = dishRouter;
