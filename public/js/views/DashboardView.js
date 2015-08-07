
window.App.DashboardView = Backbone.View.extend({
  events: {
    'click .data-table-all': 'toggleDataTableAll',
    'click .download-all': 'downloadAll',
    'click .toggle-labels-all': 'toggleLabelsAll',
    'click .all-sortAsc': 'sortAsc',
    'click .all-sortDesc': 'sortDesc',
    'click .all-sortAlpha': 'sortAlpha'
  },
  template: App.templates['public/templates/dashboard-template.handlebars'],
  initialize: function() {
    var self = this
    this.listenTo(this.model, 'change:activegeo', this.updateGeo)
    this.listenTo(this.model, 'change:key', this.updateSet)
    this.listenTo(this.model, 'change:compare', this.updateCompare)
    this.listenTo(this.model, 'change:done', this.update)
    this.render()
    var TO = false
    $(window).resize(function() {
      if (TO !== false) clearTimeout(TO)
      TO = setTimeout(function() {
        self.redrawCharts()
      }, 400)
    })
  },
  render: function() {
    $('#home').empty()
    this.$el.html(this.template(this.model.toJSON()))
    this.mapview = new App.MapView({model: this.model, el: '#map-container'})
    this.mapview.makeMap()
    this.createCharts()
  },
  createCharts: function() {
    App.chart_collection = new App.ChartCollection()
    var key = this.model.get('key'),
        compare = this.model.get('compare')

    if (key && compare) {
      App.chart_collection.reset()
      var presets = _.where(this.model.get('presets'), {compare: compare})[0]
      presets = _.where(presets.categories, {id: key})[0]
      _.each(presets.codes, function(code) {
        App.chart_collection.add(new App.Chart({
          code: code
        }))
      })
      this.drawCharts()
      $('#blurb').html(presets.blurb)
      var presetlist = new App.PresetList({model: this.model})
      $('.preset-list').html(presetlist.render().el)
      $('.preset').removeClass('active')
      $('.preset[href="#'+key+'"]').addClass('active')
      var intro = this.model.get('intros')[this.model.get('compare')]
      this.$el.find('.intro').html(intro)
    }
  },
  drawCharts: function() {
    var self = this
    var rowNumber = 0
    $('#charts .row').empty()
    App.chart_collection.each(function(chart, i) {
      var view = new App.ChartView({
          model: chart
      })
      chart.set({view: view})
      if (i % 3 == 0 && i != 0) {
        $('#charts .row').append('<div class="clearfix visible-lg"></div>')
        $('#charts .row').append('<div class="clearfix visible-md"></div>')
      }
      if (i % 2 == 0 && i != 0) {
        $('#charts .row').append('<div class="clearfix visible-sm"></div>')
      }
      var view = chart.get('view')
      $('#charts > .row').append(view.render().el)
      view.makeChart()
    })
  },
  redrawCharts: function() {
    this.mapview.map.invalidateSize()
    App.chart_collection.each(function(chart, i) {
      chart.get('view').redraw()
    })
  },
  addRow: function(rowNumber) {
    var exists = $('#row' + rowNumber).length
    if (!exists) {
      this.$el.find('#charts').append('<div id="row' + rowNumber + '" class="row"></div>')
    }
  },
  update: function() {
    App.router.changeHash()
  },
  updateGeo: function() {
    App.router.changeHash()
    App.chart_collection.each(function(chart, i) {
      chart.update()
    })
  },
  updateSet: function() {
    this.createCharts()
  },
  updateCompare: function() {
    var key = this.model.get('key'),
        compare = this.model.get('compare')
    var presets = _.where(this.model.get('presets'), {compare: compare})[0]
    presets = _.where(presets.categories, {id: key})
    if (presets.length == 0) {
      key = 'overview'
      this.model.set('key', key)
    } else {
      this.createCharts()
    }
  },
  downloadAll: function() {
    var codes = []
    App.chart_collection.each(function(chart, i) {
      codes.push(chart.get('code'))
    })
    var query = {
      geog_codes: App.dashboard.model.get('activegeo')[App.dashboard.model.get('compare')],
      criteria_codes: codes,
      compare: App.dashboard.model.get('compare'),
      csv: true,
      category: App.dashboard.model.get('key')
    }
    var params = $.param(query)
    window.location.href = 'api/stats' + '?' + params
  },
  toggleLabelsAll: function(e) {
    if (this.model.get('labels')) {
      this.model.set('labels', false)
      $(e.currentTarget).removeClass('active')
      App.chart_collection.each(function(chart, i) {
        chart.get('view').removeLabels()
      })
    } else {
      this.model.set('labels', true)
      $(e.currentTarget).addClass('active')
      App.chart_collection.each(function(chart, i) {
        chart.get('view').addLabels()
      })
    }
  },
  toggleDataTableAll: function(e) {
    if (this.model.get('tableView')) {
      this.model.set('tableView', false)
      $(e.currentTarget).removeClass('active')
      App.chart_collection.each(function(chart, i) {
        chart.get('view').deactivateTableView()
      })
    } else {
      this.model.set('tableView', true)
      $(e.currentTarget).addClass('active')
      App.chart_collection.each(function(chart, i) {
        chart.get('view').activateTableView()
      })
    }
  },
  sortAsc: function() {
    var self = this
    App.chart_collection.each(function(chart, i) {
      chart.get('view').sortAsc()
    })
  },
  sortDesc: function() {
    var self = this
    App.chart_collection.each(function(chart, i) {
      chart.get('view').sortDesc()
    })
  },
  sortAlpha: function() {
    var self = this
    App.chart_collection.each(function(chart, i) {
      chart.get('view').sortAlpha()
    })
  }
})
