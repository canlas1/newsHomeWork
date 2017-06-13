// var db = require("../models");


var express = require('express');
var router = express.Router();

module.export = function(app){

  router.get('/', function(req, res, next) {
  	console.log(req.body);
  	
  

  });

};




module.exports = router;
