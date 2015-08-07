var express = require('express')
  , presets = require('../config/presets.json')
  , uids = require('../config/uids.json')
  , pkg = require('../package.json')
  , config = require('../config/config')
  , compare = require('../comparer')

var api = new express.Router()

api.get('/stats', function(req, res) {
  compare.getData(req, res)
})

api.get('/query', function(req, res) {
  var codes = req.query.criteria_codes
  var compare_type = req.query.compare
  var geog_codes = []
  if (req.query.geog_codes) {
    geog_codes = req.query.geog_codes
  }
  var query = compare.makeQuery(codes[0], geog_codes, compare_type)
  res.json(query)
})


api.get('/presets', function(req, res) {
  res.json(require('../config/presets.json'))
})

api.get('/tables', function(req, res) {
  res.json(require('../config/tableInfo.json'))
})

module.exports = api
