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


  dishRouter
  .route("/:dishId/comments")

  .get(function(req, res, next) {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if(dish != null){
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments);
          }
          else{
            err = new Error('Dish' + req.params.dishId + 'not found');
            err.status = 404;
            return next(err);
          }
        },
        err => next(err)
      )
      .catch(err => next(err));
  })

  .post(function(req, res, next) {
    Dishes.findById(req.params.dishId)
      .then(
        dish => {
          if(dish != null){
            dish.comments.push(req.body);
            dish.save()
            .then((dish)=>{
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(dish);
            }, err => next(err));            
          }
          else{
            err = new Error('Dish' + req.params.dishId + 'not found');
            err.status = 404;
            return next(err);
          }
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .put((req,res,next) =>{
        res.statusCode = 403;
          res.end('put operation not supported on Dishes/'+ req.params.dishId)
  })
  .delete(function(req, res, next) {
    Dishes.findById(req.params.dishId)
      .then(
        dish => {
          if(dish != null){
           for(var i = (dish.comments.length-1); i>=0;i--)
           {
             dish.comments.id(dish.comments[i]._id).remove();
           }
             dish.save()
            .then((dish)=>{
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(dish);
            }, err => next(err)); 
                 
          }
          else{
            err = new Error('Dish' + req.params.dishId + 'not found');
            err.status = 404;
            return next(err);
          }
        },
        err => next(err)
      )
      .catch(err => next(err));
  });

dishRouter
  .route("/:dishId/comments/:commentId")
  .get(function(req, res, next) {
    Dishes.findById(req.params.dishId)
      .then(
        dish => {
          if(dish != null && dish.comments.id(req.params.commentId)){
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments.id(req.params.commentId));
          }
          else if (dish ==null){
            err = new Error('Dish' + req.params.dishId + 'not found');
            err.status = 404;
            return next(err);
          }
          else{
            err = new Error('Dish' + req.params.commentId + 'not found');
            err.status = 404;
            return next(err);
          }
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
      res.end("POST operation not supported on /dishes/" + req.params.dishId + '/comments '+ req.params.commentId);
    }
  )

  .put(function(req, res, next) {
    Dishes.findById(req.params.dishId)
    .then(
      dish => {
        if(dish != null && dish.comments.id(req.params.commentId)){
         if (req.body.rating) {
          dish.comments.id(req.params.commentId).rating =req.body.rating;
           
         }
         if (req.body.comment){
          dish.comments.id(req.params.commentId).comment =req.body.comment;
         }
          dish.save()
          .then((dish)=>{
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish);
          }, err => next(err));    
        }
        else if (dish == null){
          err = new Error('Dish' + req.params.dishId + 'not found');
          err.status = 404;
          return next(err);
        }
        else{
          err = new Error('Dish' + req.params.commentId + 'not found');
          err.status = 404;
          return next(err);
        }
      },
      err => next(err)
    )
      .catch(err => next(err));
  })

  .delete(function(req, res, next) {
    Dishes.findById(req.params.dishId)
    .then(
      dish => {
        if(dish != null && dish.comments.id(req.params.commentId)){
      
         
           dish.comments.id(req.params.commentId).remove();
         
           dish.save()
          .then((dish)=>{
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish);
          }, err => next(err)); 
                
        }
        else if (dish == null){
          err = new Error('Dish' + req.params.dishId + 'not found');
          err.status = 404;
          return next(err);
        }
        else{
          err = new Error('Dish' + req.params.commentId + 'not found');
          err.status = 404;
          return next(err);
        }
      },
      err => next(err)
    )
    .catch(err => next(err));
  });

module.exports = dishRouter;
