//Compare
var _ = require('underscore')
  , async = require('async')
  , redis = require('redis')
  , returndata = require('./return-data')
  , countycodes = require('../data/countycodes.json')
  , statecodes = require('../data/statecodes.json')
  , metrocodes = require('../data/metrocodes.json')

function Compare(options) {
  this.tableInfo = options.tableInfo
  this.uids = options.uids
  this.socrataDataset = options.socrataDataset
  this.redisclient = redis.createClient()
  this.geocodes = {
    'counties': countycodes,
    'states': statecodes,
    'metros': metrocodes
  }

  this.USE_CACHE = false
}

Compare.prototype.checkCache = function(code, geog_codes, next) {
  if (this.USE_CACHE) {
    var key = 'dataset:' + code + ':' + geog_codes.join(',')
    this.redisclient.get(key, function(err, obj) {
      if (obj === null) {
        next(false)
      } else {
        next(JSON.parse(obj))
      }
    })
  } else {
    next(false)
  }
}

Compare.prototype.addToCache = function(code, geog_codes, data) {
  var key = 'dataset:' + code + ':' + geog_codes.join(',')
  this.redisclient.set(key, JSON.stringify(data))
}

Compare.prototype.setSocrataDataset = function(ds) {
  this.socrataDataset = ds
}

Compare.prototype.getData = function(req, res) {
  var codes = req.query.criteria_codes

  var compare_type = req.query.compare
  var geog_codes = []
  if (req.query.geog_codes) {
    geog_codes = req.query.geog_codes
  }
  var self = this,
    all_columns = []

  function getSingleStat(code, next) {
    var Query = self.makeQuery(code, geog_codes, compare_type)
    all_columns = _.uniq(all_columns.concat(Query.columns))
    response = {
      'title': Query.column_name,
      'key': Query.column,
      'category': Query.category,
      'format': Query.format,
      'datatype': Query.datatype,
      'source': Query.source,
      'date': Query.date,
      'note': Query.note,
      'quote': Query.quote
    }
    self.socrataDataset.setUID(Query.uid)
    self.socrataDataset.query(Query.query, function(response, data) {
      data.forEach(function(d, i) {
        for(_code in self.geocodes[compare_type]) {
          if (self.geocodes[compare_type][_code] === d.geo) {
            d.code = _code
          }
        }
      })
      self.addToCache(code, geog_codes, data)
      response.data = data
      next(false, response)
    }.bind(self, response))
  }

  function addMeta(d) {
    var combined = d.data
    if (d.format.precision) {
      _.each(d.data, function(obj) {
        var x = obj[d.key]
        obj[d.key] = parseFloat(x).toFixed(d.format.precision)
      })
    }
    if (d.datatype === 'percent') {
      _.each(d.data, function(obj) {
        var x = obj[d.key]
        obj[d.key] = x + '%'
      })
    }
    if (d.datatype === 'money') {
      _.each(d.data, function(obj) {
        var x = obj[d.key]
        obj[d.key] = '$' + x
      })
    }
    var source = {}
    source['geo'] = 'Source'
    source[d.key] = d.source
    var date = {}
    date['geo'] = 'Date'
    date[d.key] = d.date
    var note = {}
    note['geo'] = 'Note'
    note[d.key] = d.note
    var quote = {}
    quote['geo'] = 'Quote'
    quote[d.key] = d.quote
    combined.push(source)
    combined.push(date)
    combined.push(note)
    combined.push(quote)
    return combined
  }

  async.map(codes, getSingleStat, function(err, response) {
    if (!req.query.csv) {
      res.json(response[0])
    } else {
      var geos = response.map(function(r) {
        return _.pluck(r.data, 'geo')
      })
      geos = _.uniq(_.flatten(geos))

      var combined = []
      geos.forEach(function(geo) {
        combined.push({geo: geo})
      })
      response.forEach(function(r) {
        var row = {}
        r.data.forEach(function(obj) {
          var orig = _.findWhere(combined, {geo: obj.geo})
          var keys = _.without(_.keys(obj), 'geo', 'code')
          _.each(keys, function(key) {
            orig[key] = obj[key]
          })
        })
      })
      combined = combined.map(function(row) {
        var newRow = {}
        for (var key in row) {
          if (key === 'geo') {
            newRow.geo = row[key]
          } else {
            var title = _.findWhere(response, {key: key}).title
            newRow[title] = row[key]
          }
        }
        return newRow
      })

      var fileName = ''
      var category = req.query.category
      if (all_columns.length === 2) {
        fileName = all_columns[1]
      } else {
        fileName = category
      }

      returndata(res, combined, req.query.csv, fileName)
    }
  })
}

Compare.prototype.makeQuery = function(criteria_code, geog_codes, compare_type) {
  var query,
      code,
      uid,
      category,
      column,
      column_name,
      columns = [],
      geos,
      geonames = [],
      format = {},
      datatype,
      source = '',
      date = '',
      note = '',
      quote = '',
      geotype

  code = criteria_code
  this.tableInfo.forEach(function(table, index) {
    var search = _.where(table.columns, {tableColumnId: parseInt(code)})
    if (search.length) {
      uid = table.id
      column = search[0].fieldName
      column_name = search[0].name
      format = search[0].format
      datatype = search[0].dataTypeName
      if (search[0].Source) {
        source = search[0].Source
      }
      if (search[0]['Date of Data']) {
        date = search[0]['Date of Data']
      }
      if (search[0].Note) {
        note = search[0].Note
      }
      if (search[0].Quote) {
        quote = search[0].Quote
      }
    }
  })

  category = _.where(this.uids, {uid: uid})[0].category
  geos = this.geocodes[compare_type]
  geonames = []

  if (compare_type === 'counties') {
    geotype = 'county'
  } else if (compare_type === 'states') {
    geotype = 'state'
  } else if (compare_type === 'metros') {
    geotype = 'metro'
  }
  columns.push(geotype)
  columns.push(column_name)

  if (geog_codes.length > 0) {
    _.each(geog_codes, function(code) {
      geonames.push(geos[code])
    })
  } else {
    _.each(geos, function(value, key) {
      geonames.push(value)
    })
  }
  query = '$select=' + column + ', ' + geotype + ' as geo'
  query += '&$where='
  _.each(geonames, function(geoname, idx) {
    query += geotype + "='" + escape(geoname.replace("'", "''")) + "'"
    if (idx+1 < geonames.length) query += ' or '
  })

  return {
    query: query,
    column: column,
    category: category,
    columns: columns,
    column_name: column_name,
    format: format,
    datatype: datatype,
    source: source,
    date: date,
    note: note,
    quote: quote,
    uid: uid,
    aliases: ['geo', column]
  }
}

exports.Compare = Compare
