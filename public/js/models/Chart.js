// Chart Model
// Handles chart data operations

window.App.Chart = Backbone.Model.extend({
  defaults: {
    code: 'C001',
    table: false,
    percent: false,
    money: false,
    labels: true,
    source: 'Source',
    response: [],
    loading: false
  },
  initialize: function() {
    //this.update()
  },
  update: function() {
    var self = this
    if (this.get('request')) {
      this.get('request').abort()
    }
    var activegeo = App.Model.get('activegeo')[App.Model.get('compare')]
    if (this.isCached()) {
      var data = _.clone(this.get('cache').data)
      var newdata = _.filter(data, function(d) {
        return _.contains(activegeo, parseInt(d.code, 10))
      })
      var response = _.clone(this.get('cache'))
      response.data = newdata
      this.handleResponse(response)
    } else {
      var query = {
          geog_codes: activegeo,
          criteria_codes: [this.get("code")],
          compare: App.Model.get('compare')
      }
      self.set('loading', true)
      var request = $.ajax({
        url: 'api/stats',
        data: query,
        dataType: 'json'
      })
      request.done(function(data) {
        self.createCache(data)
        self.handleResponse(data)
      })
      request.always(function() {
        self.set('loading', false)
      })
      self.set("request", request)
    }
  },
  isCached: function() {
    var isCached = true
    if (this.get('cache')) {
      var cachedgeos = _.map(_.pluck(this.get('cache').data, 'code'), function(c) {return parseInt(c, 10) })
      var activegeo = App.Model.get('activegeo')[App.Model.get('compare')]
      if (activegeo.length <= cachedgeos.length && activegeo.length > 0) {
        _.each(activegeo, function(geocode) {
          if (_.contains(cachedgeos, geocode) == false) {
            isCached = false
          }
        })
      } else {
        isCached = false
      }
    } else {
      isCached = false
    }
    return isCached
  },
  createCache: function(cacheresponse) {
    var self = this
    if (!this.get('cache')) {
      this.set('cache', cacheresponse)
    } else {
      var cachedata = _.clone(this.get('cache').data)
      var cachedatacodes = _.pluck(this.get('cache').data, 'code')
      var newdata = cacheresponse.data
      _.each(newdata, function(newd) {
        if (!_.contains(cachedatacodes, newd.code)) {
          self.get('cache').data.push(newd)
        }
      })
    }
  },
  handleResponse: function(data) {
    this.set('data', data)
    var chartdata = this.prepareData(data)
    this.set('chartdata', chartdata)
  },
  prepareData: function(data) {
    var self = this
    this.set("title", data.title)
    this.set("category", data.category)
    this.set("key", data.key)
    if (data.source) {
      this.set('source', data.source)
    }
    if (data.note) {
      this.set('note', data.note)
    }
    if (data.date) {
      this.set('date', data.date)
    }
    if (data.quote) {
      this.set('quote', data.quote)
    }
    if (data.datatype === 'percent') {
      this.set('percent', true)
    }
    if (data.datatype === 'money') {
      this.set('money', true)
    }
    var chartdata = []
    _.each(data.data, function(obj) {
      var value = obj[self.get('key')]
      obj.geo = obj.geo.replace(" County", "")
      obj.geo = obj.geo.replace(" metro", "")
      if (obj.geo !== 'Source 1' && obj.geo !== 'Source 2' &&obj.geo !== 'Date of Data'&& obj.geo !== 'Note 1'&& obj.geo !== 'Quote 1') {
        if (typeof value == 'undefined') {
          value = null
          obj[self.get('key')] = null
        }
        chartdata.push(obj)
      } else {
        if (obj.geo === 'Source 1') {
          self.set('source', value)
        }
        if (obj.geo === 'Date of Data') {
          self.set('date', value)
        }
        if (obj.geo === 'Note 1' && value) {
          self.moreInfo = true
          self.set('note', value)
        }
        if (obj.geo === 'Quote 1' && value) {
          self.moreInfo = true
          self.set('quote', value)
        }
      }
    })
    return chartdata
  },
  sortDesc: function(e) {
    var self = this
    var chartdata = _.sortBy(this.get('chartdata'), function(obj) {
      return parseFloat(obj[self.get('key')]) || 0
    })
    chartdata = chartdata.reverse()
    this.set({chartdata: chartdata})
  },
  sortAsc: function() {
    var self = this
    var chartdata = _.sortBy(this.get('chartdata'), function(obj) {
      return parseFloat(obj[self.get('key')]) || 0
    })
    this.set({chartdata: chartdata})
  },
  sortAlpha: function() {
    var self = this
    var chartdata = _.sortBy(this.get('chartdata'), function(obj) {
      return obj['geo']
    })
    this.set({chartdata: chartdata})
  }
})
