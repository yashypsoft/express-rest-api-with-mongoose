var express = require("express");
var leaderRouter = express.Router();
const mongoose = require("mongoose");
const bodyParsher = require("body-parser");

const Leaders = require("../models/leaders");

leaderRouter 
  .route("/")

  .get(function(req, res, next) {
Leaders.find({})
      .then(
        leaders => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leaders);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })

  .post(function(req, res, next) {
        Leaders.create(req.body)
      .then(
        leader => {
          console.log("leader Created", leader);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .put((req,res,next) =>{
        res.statusCode = 403;
          res.end('put operation not supported on leaders')
  })
  .delete(function(req, res, next) {
        Leaders.remove({})
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

leaderRouter
  .route("/:leaderId")
  .get(function(req, res, next) {
        Leaders.findById(req.params.leaderId)
      .then(
        leaders => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leaders);
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
      res.end("POST operation not supported on /leaders/" + req.params.leaderId);
    }
  )

  .put(function(req, res, next) {
        Leaders.findByIdAndUpdate(
      req.params.leaderId,
      {
        $set: req.body
      },
      { new: true }
    )
      .then(
        leaders => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leaders);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })

  .delete(function(req, res, next) {
        Leaders.findByIdAndRemove(req.params.leaderId)
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


module.exports = leaderRouter;
