var express = require("express");
var promoRouter = express.Router();
const mongoose = require("mongoose");
const bodyParsher = require("body-parser");

const Promotions = require("../models/promotions");

promoRouter
  .route("/")

  .get(function(req, res, next) {
Promotions.find({})
      .then(
        promotions => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotions);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })

  .post(function(req, res, next) {
        Promotions.create(req.body)
      .then(
        promotion => {
          console.log("Promotion Created", promotion);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .put((req,res,next) =>{
        res.statusCode = 403;
          res.end('put operation not supported on Promotions')
  })
  .delete(function(req, res, next) {
        Promotions.remove({})
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

promoRouter
  .route("/:promoId")
  .get(function(req, res, next) {
        Promotions.findById(req.params.promoId)
      .then(
        promotion => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
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
      res.end("POST operation not supported on /promotions/" + req.params.promoId);
    }
  )

  .put(function(req, res, next) {
        Promotions.findByIdAndUpdate(
      req.params.promoId,
      {
        $set: req.body
      },
      { new: true }
    )
      .then(
        promotion => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })

  .delete(function(req, res, next) {
        Promotions.findByIdAndRemove(req.params.promoId)
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


module.exports = promoRouter;
