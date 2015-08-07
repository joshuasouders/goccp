var express = require('express')
  , _ = require('underscore')
  , Admin = require('../lib/Admin').Admin
  , tableInfo = require('../config/tableInfo.json')
  , presets = require('../config/presets.json')
  , uids = require('../config/uids.json')
  , pkg = require('../package.json')
  , config = require('../config/config')
  , compare = require('../comparer')

var admin = new Admin()
var adminRouter = new express.Router()

adminRouter.get('/', admin.restrict, function(req, res) {
  var data = {
    uids: uids,
    tables: tableInfo,
    presets: presets,
    auth: req.session,
    page: 'home',
    pretty: true
  }
  res.render('admin', data, function(err, html) {
    res.send(html)
  })
})

adminRouter.get('/socrata', admin.restrict, function(req, res) {
  var data = {
    uids: uids,
    tables: tableInfo,
    presets: presets,
    auth: req.session,
    page: 'socrata',
    pretty: true
  }
  res.render('socrata', data, function(err, html) {
    res.send(html)
  })
})

adminRouter.get('/login', function(req, res) {
  res.render('login', {
    auth: req.session,
    page: 'login',
  })
})

adminRouter.post('/login', function(req, res) {
  admin.authenticate(req.body.username, req.body.password, function(err, user) {
    if (user) {
      req.session.regenerate(function(err) {
        req.session.user = user
        req.session.success = 'Authenticated as ' + user.name
        res.redirect(config.mount + '/admin')
      })
    } else {
      req.session.error = 'Authentication failed, please check your '
        + ' username and password.'
      res.render('login', {
        auth: req.session,
        page: 'login',
      })
    }
  })
})

adminRouter.get('/logout', function(req, res) {
  req.session.destroy(function() {
    res.redirect(config.mount + '/admin')
  })
})

adminRouter.get('/update/:geo', admin.restrict, function(req, res) {
  var compare = req.params.geo
  var geo_presets = _.where(presets, {compare: compare})
  var geo_hash = {
    'counties': 'Counties',
    'states': 'States',
    'metros': 'Metros'
  }
  var geo_tables = _.filter(tableInfo, function(table) {
    if (table.name.indexOf(geo_hash[compare]) >= 0) return true
    else return false
  })
  var data = {
    uids: uids,
    tableInfo: geo_tables,
    presets: geo_presets,
    compare: compare,
    page: compare,
    auth: req.session,
    pretty: true
  }
  res.render('update', data, function(err, html) {
    res.send(html)
  })
})


adminRouter.post('/addCategory', admin.restrict, function(req, res) {
  var compare = req.body.category_select.split(',')[0]
  var category = req.body.category_select.split(',')[1]
  var id = req.body.stat_id
  admin.addCategoryToStatistic(presets, compare, category, id, function(_presets) {
    presets = _presets
    res.writeHead(301, { 'Location': 'admin' })
    res.end()
  })
})

adminRouter.post('/removeCategory', admin.restrict, function(req, res) {
  var compare = req.body.category_select.split(',')[0]
  var category = req.body.category_select.split(',')[1]
  var id = req.body.stat_id
  admin.removeCategoryFromStatistic(presets, compare, category, id, function(_presets) {
    presets = _presets
    res.send({'error': false, 'success': true})
  })
})

adminRouter.post('/reorder', admin.restrict, function(req, res) {
  var compare = req.body.category_select.split(',')[0]
  var category = req.body.category_select.split(',')[1]
  var codes = req.body.codes
  admin.reorder(presets, compare, category, codes, function(_presets) {
    presets = _presets
    res.send({'error': false, 'success': true})
  })
})

adminRouter.post('/addColumns', admin.restrict, function(req, res) {
  var compare = req.body.category_select.split(',')[0]
  var category = req.body.category_select.split(',')[1]
  var codes = req.body.codes
  admin.addColumns(presets, compare, category, codes, function(_presets) {
    presets = _presets
    res.send({'error': false, 'success': true})
  })
})

adminRouter.post('/removeColumn', admin.restrict, function(req, res) {
  var compare = req.body.category_select.split(',')[0]
  var category = req.body.category_select.split(',')[1]
  var code = req.body.code
  admin.removeColumn(presets, compare, category, code, function(_presets) {
    presets = _presets
    res.send({'error': false, 'success': true})
  })
})

adminRouter.post('/updateBlurb', admin.restrict, function(req, res) {
  var compare = req.body.category_select.split(',')[0]
  var category = req.body.category_select.split(',')[1]
  var blurb = req.body.blurb
  admin.updateBlurb(presets, compare, category, blurb, function(_presets) {
    presets = _presets
    res.send({'error': false, 'success': true})
  })
})

adminRouter.post('/updateColor', admin.restrict, function(req, res) {
  var compare = req.body.category_select.split(',')[0]
  var category = req.body.category_select.split(',')[1]
  var color = req.body.color
  admin.updateColor(presets, compare, category, color, function(_presets) {
    presets = _presets
    res.send({'error': false, 'success': true})
  })
})

adminRouter.post('/getNewTableInfo', admin.restrict, function(req, res) {
  admin.getNewTableInfo(uids, tableInfo, function(_tableInfo) {
    tableInfo = _tableInfo
    compare.tableInfo = _tableInfo
    res.send({'error': false, 'success': true})
  })
})

adminRouter.get('/resetPresets', admin.restrict, function(req, res) {
  admin.resetPresets(presets, function(_presets) {
    presets = _presets
    res.redirect(config.mount + '/admin')
  })
})

adminRouter.get('/clearCache', admin.restrict, function(req, res) {
  admin.clearCache()
  res.redirect(config.mount + '/admin')
})

module.exports = adminRouter
