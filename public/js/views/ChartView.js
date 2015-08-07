// Chart View
// Displays a Chart Model

window.App.ChartView = Backbone.View.extend({
  tagName: 'div',
  className: 'col-md-4 col-sm-6',
  infoVisible: false,
  moreInfo: false,
  response: false,
  cacheresponse: false,
  cache: false,
  events: {
    'click .settings-toggle': 'settings',
    'click .remove': 'remove',
    'click .embed': 'embed',
    'click .data-table': 'toggleTableView',
    'click .toggle-labels': 'toggleLabels',
    'click .download': 'download',
    'click .sortAsc': 'sortAsc',
    'click .sortDesc': 'sortDesc',
    'click .sortAlpha': 'sortAlpha',
    'click .info': 'toggleInfo'
  },
  template: App.templates['public/templates/chart-template.handlebars'],
  initialize: function() {
    this.listenTo(this.model, 'change:chartdata', this.update)
    this.listenTo(this.model, 'change:loading', this.loading)
    this.model.update()
  },
  update: function() {
    this.setChartOptions()
    this.setDetails()
    this.setBarColor()
    this.chart.update(this.model.get('chartdata'))
    this.table.update(this.model.get('chartdata'))
    if (App.Model.get('tableView')) {
      this.activateTableView()
    }
  },
  setChartOptions: function() {
    var data = this.model.get('data')
    this.chart.options.x = data.key
    this.table.options.columns = ['geo', data.key]
    if (data.format) {
      if (data.format.precision) {
        var formatter = d3.format(',.' + data.format.precision + 'f')
        this.chart.options.valueFormat = formatter
        this.table.options.valueFormat = formatter
      }
    }
    if (data.datatype === 'percent') {
      this.chart.options.percent = true
      this.table.options.percent = true
    }
    if (data.datatype === 'money') {
      this.chart.options.money = true
      this.table.options.money = true
    }
  },
  setDetails: function() {
    if (typeof this.model.get('source') !== 'undefined') {
      var source = 'Source: ' + this.model.get('source')
      if (typeof this.model.get('date') !== 'undefined') {
        source += ', ' + this.model.get('date')
      }
      this.$el.find('.source').html(source)
    }
    if (this.moreInfo) {
      this.$el.find('.more-info').empty()
    }
    if (this.model.get('note')) {
      this.$el.find('.more-info').html('<p>' + this.model.get('note') + '</p>')
    }
    if (this.model.get('quote')) {
      this.$el.find('.more-info').append('<p>' + this.model.get('quote') + '</p>')
    }
    var category_name = ''
    if (this.model.get('category')) {
      var presets = _.where(App.Model.get('presets'), {compare: App.Model.get('compare')})[0]
      category_name = _.where(presets.categories, {id: this.model.get('category')})[0].name
    }
    this.$el.find('.title h3').html(this.model.get('title'))
    this.$el.find('.subtitle').html(category_name)
  },
  render: function() {
    this.model.set({
      category: '',
      source: '',
      title: ''
    })
    this.$el.html(this.template(this.model.toJSON()))
    this.$el.find('.chartTool').tooltip({
      animation: false
    })
    return this
  },
  settings: function(e) {
    var $el = this.$el.find('.settings-container')
    $el.toggle()
  },
  toggleLabels: function() {
    if (this.model.get('labels')) {
      this.removeLabels()
    } else {
      this.addLabels()
    }
  },
  addLabels: function() {
    this.chart.options.drawY = true
    this.model.set('labels', true)
    this.$el.find('.toggle-labels').addClass('active')
    this.chart.update(this.model.get('data'))
  },
  removeLabels: function() {
    this.chart.options.drawY = false
    this.model.set('labels', false)
    this.$el.find('.toggle-labels').removeClass('active')
    this.chart.update(this.model.get('data'))
  },
  toggleTableView: function() {
    if (this.model.get('table')) {
      this.deactivateTableView()
    } else {
      this.activateTableView()
    }
  },
  activateTableView: function() {
    this.$el.find('.data-table').addClass('active')
    var el = '#id_' + this.model.get('code')
    $(el).find('.geodash').hide()
    $(el).find('table').show()
    $(el).css('overflow-x', 'hidden')
    $(el).css('overflow-y', 'auto')
    this.model.set('table', true)
  },
  deactivateTableView: function() {
    this.$el.find('.data-table').removeClass('active')
    var el = '#id_' + this.model.get('code')
    $(el).find('table').hide()
    $(el).find('.geodash').show()
    this.model.set('table', false)
    $(el).css('overflow', 'hidden')
  },
  download: function() {
    var query = {
      geog_codes: App.Model.get('activegeo')[App.Model.get('compare')],
      criteria_codes: [this.model.get('code')],
      compare: App.Model.get('compare'),
      csv: true
    }
    var params = $.param(query)
    var url =  'api/stats?' + params
    window.location.href = url
  },
  makeChart: function() {
    var el = '#id_' + this.model.get('code')
    $(el).empty()
    var highlight = []
    if (App.Model.get('compare') === 'states') {
      highlight = ['Maryland']
    } else if (App.Model.get('compare') === 'metros') {
      highlight = ['Baltimore metro', 'Washington, DC metro']
    }
    this.chart = new GeoDash.BarChartHorizontal(el, {
      x: this.model.get('key'),
      y: 'geo',
      percent: this.model.get('percent'),
      money: this.model.get('money'),
      highlight: highlight,
      drawX: true,
      drawY: true,
      barHeight: 15,
      opacity: 0.6,
      roundRadius: 4,
      yWidth: 80,
      barColor: '#333',
      xTicksCount: 4
    })
    this.table = new GeoDash.TableChart(el, {
      columns: ['geo', this.model.get('key')],
      percent: this.model.get('percent'),
      money: this.model.get('money'),
      highlight: highlight,
      color: '#e4e4e4'
    })
  },
  redraw: function() {
    this.makeChart()
    this.update()
  },
  setBarColor: function() {
    var self = this
    _.each(App.Model.get('presets'), function(preset) {
      if (preset.compare === App.Model.get('compare')) {
        _.each(preset.categories, function(preset_category) {
          if (preset_category.id === self.model.get('category')) {
            self.chart.options.colors = [preset_category.color]
          }
        })
      }
    })
  },
  loading: function(e) {
    if (this.model.get('loading')) {
      this.$el.find('.loader').addClass('loading')
    } else {
      this.$el.find('.loader').removeClass('loading')
    }
  },
  remove: function() {
    this.$el.remove()
    App.chart_collection.remove(this.model)
    App.dashboard.drawCharts()
  },
  embed: function() {
    var $el = this.$el.find('.embed-container')
    $el.toggle()
    var geos = App.Model.get('activegeo')[App.Model.get('compare')]
    var url = 'http://apps.esrgc.org/dashboards/countycomparison/#embed/compare/'
    url += App.Model.get('compare')
    url += '/code/'
    url += this.model.get('code')
    if (geos.length) {
      url += '/geo/'
      url += geos.join()
    }
    var iframe = '&ltiframe width="400" height="600" frameBorder="0" src="'
    iframe += url
    iframe += '"&gt&lt/iframe&gt'
    $el.find('textarea').html(iframe)
  },
  sortDesc: function(e) {
    this.model.sortDesc()
  },
  sortAsc: function() {
    this.model.sortAsc()
  },
  sortAlpha: function() {
    this.model.sortAlpha()
  },
  toggleInfo: function() {
    if (this.infoVisible) {
      this.$el.find('.chart').show()
      this.$el.find('.more-info').hide()
      this.$el.find('.chart-container').css('overflow-y', 'hidden')
    } else {
      var chartHeight = this.$el.find('.chart').height() + 10
      this.$el.find('.more-info').css('min-height', chartHeight)
      this.$el.find('.chart-container').css('overflow-y', 'scroll')
      this.$el.find('.chart').hide()
      this.$el.find('.more-info').show()
    }
    this.infoVisible = !this.infoVisible
  },
})
