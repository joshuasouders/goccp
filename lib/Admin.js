//Admin
var _ = require('underscore')
  , fs = require('fs')
  , async = require('async')
  , redis = require('redis')
  , path = require('path')
  , Socrata = require('./Socrata')
  , config = require('../config/config')
  , presets = require('../config/presets.json')

function Admin(options) {
  this.config = config.socrata
  this.users = {
    admin: {
      name: 'admin',
      pass: 'admin'
    }
  }
}

Admin.prototype.clearCache = function() {
  var client = redis.createClient()
  client.keys('dataset:*', function(err, replies) {
    replies.forEach(function(key) {
      client.del(key)
    })
    client.quit()
  })
}

Admin.prototype.getNewTableInfo = function(uids, tableInfo, next) {
  var self = this
  tableInfo = []
  var getSocrataTable = function(uid, callback) {
    var socrataDataset = new Socrata.Dataset()
    socrataDataset.setHost('https://data.maryland.gov')
    socrataDataset.setAppToken(self.config.apptoken)
    socrataDataset.setUID(uid.uid)
    socrataDataset.getRows(function(rows) {
      var metadata = [
        {
          'name': 'Source',
          'values': {}
        },
        {
          'name': 'Date of Data',
          'values': {}
        },
        {
          'name': 'Note',
          'values': {}
        },
        {
          'name': 'Quote',
          'values': {}
        }
      ]
      rows.data.forEach(function(d) {
        metadata.forEach(function(md) {
          d.forEach(function(val) {
            if (val === md.name) {
              var cells = _.find(d, function(val) {
                if (typeof val == 'string' && val.indexOf('invalidCells') > -1) {
                  return true
                } else {
                  return false
                }
              })
              if (typeof cells != 'undefined') {
                md.values = JSON.parse(cells).invalidCells
              }
            }
          })
        })
      })

      socrataDataset.viewData(function(data) {
        data.columns.forEach(function(column) {
          metadata.forEach(function(md) {
            if (md.values[column.tableColumnId]) {
              column[md.name] = md.values[column.tableColumnId]
            }
          })
        })
        tableInfo.push(data)
        callback()
      })

    })
  }

  async.each(uids, getSocrataTable, function(err) {
    next(tableInfo)
    fs.writeFile('config/tableInfo.json', JSON.stringify(tableInfo), function (err) {
      if (err) throw err
      console.log('It\'s saved!')
    })
  })
}

Admin.prototype.savePresets = function(presets) {
  fs.writeFile(path.resolve('config/presets.json'), JSON.stringify(presets), function (err) {
    if (err) throw err
  })
}

Admin.prototype.authenticate = function(name, pass, fn) {
  var user = this.users[name]
  if (!user) return fn(new Error('cannot find user'))
  if (user.pass == pass) {
    fn(null, user)
  } else {
    fn(new Error('invalid password'))
  }
}

Admin.prototype.restrict = function(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    req.session.error = ''
    res.render('login', {
      auth: req.session,
      page: 'login',
    })
  }
}

Admin.prototype.addCategoryToStatistic = function(presets, compare, category, id, next) {
  _.each(presets, function(preset) {
    if (preset.compare === compare) {
      _.each(preset.categories, function(preset_category) {
        if (preset_category.id === category) {
          if (!_.contains(preset_category.codes, id)) {
            preset_category.codes.push(id)
          }
        }
      })
    }
  })
  this.savePresets(presets)
  next(presets)
}

Admin.prototype.removeCategoryFromStatistic = function(presets, compare, category, id, next) {
  _.each(presets, function(preset) {
    if (preset.compare === compare) {
      _.each(preset.categories, function(preset_category) {
        if (preset_category.id === category) {
          if (_.contains(preset_category.codes, id)) {
            preset_category.codes = _.without(preset_category.codes, id)
          }
        }
      })
    }
  })
  this.savePresets(presets)
  next(presets)
}

Admin.prototype.quickChange = function(presets, categories, category_ids, next) {
  category_ids.forEach(function(category_id) {
    var compare = category_id.split(',')[0]
    var category = category_id.split(',')[1]
    var codes = categories[category_id].split(',')
    _.each(presets, function(preset) {
      if (preset.compare === compare) {
        _.each(preset.categories, function(preset_category) {
          if (preset_category.id === category) {
            preset_category.codes = codes
          }
        })
      }
    })
  })
  this.savePresets(presets)
  next(presets)
}

Admin.prototype.reorder = function(presets, compare, category, codes, next) {
  if (typeof codes === 'string') codes = [codes]
  _.each(presets, function(preset) {
    if (preset.compare === compare) {
      _.each(preset.categories, function(preset_category) {
        if (preset_category.id === category) {
          if (!codes) {
            preset_category.codes = []
          } else{
            preset_category.codes = codes
          }
        }
      })
    }
  })
  this.savePresets(presets)
  next(presets)
}

Admin.prototype.addColumns = function(presets, compare, category, codes, next) {
  _.each(presets, function(preset) {
    if (preset.compare === compare) {
      _.each(preset.categories, function(preset_category) {
        if (preset_category.id === category) {
          var new_codes = preset_category.codes.concat(codes)
          new_codes = _.uniq(new_codes)
          preset_category.codes = new_codes
        }
      })
    }
  })
  this.savePresets(presets)
  next(presets)
}

Admin.prototype.removeColumn = function(presets, compare, category, code, next) {
  _.each(presets, function(preset) {
    if (preset.compare === compare) {
      _.each(preset.categories, function(preset_category) {
        if (preset_category.id === category) {
          var new_codes = _.without(preset_category.codes, code)
          preset_category.codes = new_codes
        }
      })
    }
  })
  this.savePresets(presets)
  next(presets)
}

Admin.prototype.updateBlurb = function(presets, compare, category, blurb, next) {
  _.each(presets, function(preset) {
    if (preset.compare === compare) {
      _.each(preset.categories, function(preset_category) {
        if (preset_category.id === category) {
          preset_category.blurb = blurb
        }
      })
    }
  })
  this.savePresets(presets)
  next(presets)
}

Admin.prototype.updateColor = function(presets, compare, category, color, next) {
  _.each(presets, function(preset) {
    if (preset.compare === compare) {
      _.each(preset.categories, function(preset_category) {
        if (preset_category.id === category) {
          preset_category.color = color
        }
      })
    }
  })
  this.savePresets(presets)
  next(presets)
}

Admin.prototype.resetPresets = function(presets, next) {
  _.each(presets, function(preset) {
    _.each(preset.categories, function(preset_category) {
      preset_category.codes = []
    })
  })
  this.savePresets(presets)
  next(presets)
}

exports.Admin = Admin
