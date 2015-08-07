
window.App.Router = Backbone.Router.extend({
  routes: {
    '': 'home',
    'home': 'home',
    'compare/:compare': 'set',
    'compare/:compare/set/:key/(geo/:geo)': 'set',
    'compare/:compare/set/:key(/geo/:geo)': 'set',
    'embed/compare/:compare/code/:code/(geo/:geo)': 'embed',
    'embed/compare/:compare/code/:code(/geo/:geo)': 'embed',
    'embed': 'embed'
  },
  home: function() {
    if (App.dashboard) {
      App.dashboard.remove()
      App.dashboard.mapview.remove();
      $('.wrap').append('<div id="dashboard"></div>')
    }
    new App.HomeView({model: App.Model, el: '#dashboard'})
  },
  set: function(compare, key, geo) {
    if (compare) {
      App.Model.set({compare: compare})
    }
    if (key) {
      App.Model.set({key: key});
    }
    var activegeo = App.Model.get('activegeo')
    if (geo) {
      geo = _.map(geo.split(','), function(i) { return parseInt(i) })
      activegeo[compare] = geo
      App.Model.set({activegeo: activegeo })
    }
    App.dashboard = new App.DashboardView({model: App.Model, el: '#dashboard'})
  },
  embed: function(compare, code, geo) {
    $('body').html('<div id="embed"></div>')
    App.dashboard = {}
    App.dashboard.model = App.Model
    
    if (compare) {
      App.Model.set({compare: compare})
    }

    var activegeo = App.Model.get('activegeo')
    if (geo) {
      geo = _.map(geo.split(','), function(i) { return parseInt(i) })
      activegeo[compare] = geo
      App.Model.set({activegeo: activegeo })
      App.Model.trigger('change:activegeo')
    }

    var chart = new App.Chart({
      code: code
    })

    var view = new App.ChartView({
        model: chart
    })

    $('body').css('background', '#fff')
    $('#embed').append(view.render().el)
    view.makeChart()
    $(view.el).removeClass()
    view.update()
  },
  changeHash: function() {
    var hash = 'compare/' + App.Model.get('compare')

    if (App.Model.get('key')) {
      hash += '/set/' + App.Model.get('key')
    }

    var geos = App.Model.get('activegeo')[App.Model.get('compare')]
    if (geos.length) {
      hash += '/geo/' + geos
    }

    this.navigate(hash)
  }
})
