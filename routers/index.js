var express = require('express')
  , pkg = require('../package.json')

var index = new express.Router()

index.get('/', function(req, res) {
  res.render('index', {
    version: pkg.version,
    name: pkg.name,
    env: process.env.NODE_ENV
  })
})

module.exports = index
