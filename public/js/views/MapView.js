
window.App.MapView = Backbone.View.extend({
  events: {
    'click .map-tool': 'switchGeo',
    'click #reset': 'reset',
    'click #list': 'list',
    'click #selectAll': 'selectAll',
    'click .geolistBtn': 'addGeoFromList'
  },
  template: App.templates['public/templates/map-template.handlebars'],
  list_template: App.templates['public/templates/geolist-template.handlebars'],
  initialize: function() {
    this.listenTo(this.model, 'change:compare', this.switchLayer)
    this.listenTo(this.model, 'change:activegeo', this.update)
    this.render()
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()))
  },
  update: function(model, activegeo) {
    var self = this
    var activegeo = this.model.get('activegeo')[this.model.get('compare')]
    var style = self.style2,
        style2 = self.MDstyle
    if (this.model.get('compare') === 'metros') {
      style = self.geojsonMarkerOptions2
      style2 = self.geojsonMarkerOptions3
    }
    var layer = this.layerHash[this.model.get('compare')]
    layer.eachLayer(function(layer) {
      if (self.model.get('compare') === 'metros') {
        layer.setStyle(self.geojsonMarkerOptions)
      } else {
        layer.setStyle(self.style)
      }
    })
    $('.geolistBtn').each(function(idx) {
      $(this).removeClass('btn-primary')
    })
    if (activegeo.length) {
      _.each(activegeo, function(geo, i) {
        layer.eachLayer(function(layer) {
          if (geo == layer.feature.properties.ID) {
            if (App.Model.get('defaultgeos')[App.Model.get('compare')].indexOf(layer.feature.properties.ID) >= 0) {
              layer.setStyle(style2)
            } else {
              layer.setStyle(style)
            }
          }
        })
        $('.geolistBtn').each(function(idx) {
          if ($(this).attr('id') == geo) {
            $(this).addClass('btn-primary')
          }
        })
      })
    } else {
      layer.eachLayer(function(layer) {
        layer.setStyle(style)
      })
      $('.geolistBtn').each(function(idx) {
        $(this).addClass('btn-primary')
      })
    }
  },
  makeMap: function() {
    var self = this
    this.countycenter = new L.LatLng(38.80547022, -77.4371337890)
    this.statecenter = new L.LatLng(39, -105.1611)
    this.map = new L.Map('map', {
      attributionControl: false,
      touchZoom: false,
      doubleClickZoom: false,
      scrollWheelZoom: false,
      minZoom: 3,
      maxZoom: 8
    })
    this.topPane = this.map._createPane('leaflet-top-pane', this.map.getPanes().mapPane)
    $('.leaflet-top.leaflet-right').html('<div class="geom-hover"></div>')

    this.style = {
      fillColor: '#fff',
      fillOpacity: 0,
      color: '#000',
      strokeOpacity: 1,
      weight: 0
    }

    this.style2 = {
      fillColor: '#FFC233',
      fillOpacity: 0.6,
      color: '#000',
      strokeOpacity: 1,
      weight: 0
    }

    this.MDstyle = {
      fillColor: '#ffc121',
      fillOpacity: 0.8,
      color: '#000',
      strokeOpacity: 1,
      weight: 0
    }

    this.geojsonMarkerOptions = {
      radius: 5,
      fillColor: '#333',
      color: '#000',
      weight: 1,
      opacity: 0.5,
      fillOpacity: 0.8
    }

    this.geojsonMarkerOptions2 = {
      radius: 5,
      fillColor: '#FFC233',
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.6
    }

    this.geojsonMarkerOptions3 = {
      radius: 5,
      fillColor: '#f7ad00',
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }

    var basemap = L.tileLayer('http://{s}.tiles.mapbox.com/v3/esrgc.map-4zj131o4/{z}/{x}/{y}.png').addTo(this.map)
    var countyoutline = L.tileLayer('http://{s}.tiles.mapbox.com/v3/esrgc.countyoutline/{z}/{x}/{y}.png')
    this.countylabels = L.tileLayer('http://{s}.tiles.mapbox.com/v3/esrgc.countylabelsonly/{z}/{x}/{y}.png')
    this.countyVectors = L.geoJson(mdcnty, {
      style: function (feature) {
        return self.style
      },
      onEachFeature: function (feature, layer) {
        layer.on('mouseover', function(e) {
          var hovertext = feature.properties.name
          $('.geom-hover').html(hovertext)
          $('.geom-hover').show()
        })
        layer.on('mouseout', function(e) {
          $('.geom-hover').html('')
          $('.geom-hover').hide()
        })
        layer.on('click', function(x) {
          var activegeo = _.clone(self.model.get('activegeo'))
          var geos = _.clone(self.model.get('activegeo')[self.model.get('compare')])
          if (_.contains(geos, feature.properties.ID)) {
            geos = _.without(geos, feature.properties.ID)
          } else {
            geos.push(feature.properties.ID)
          }
          geos = _.union(geos, App.Model.get('defaultgeos')[App.Model.get('compare')])
          activegeo['counties'] = geos
          self.model.set({'activegeo': activegeo})
          self.update()
        })
      }
    })
    this.countygroup = L.layerGroup([this.countyVectors, countyoutline])

    var stateTiles = L.tileLayer('http://{s}.tiles.mapbox.com/v3/esrgc.states6/{z}/{x}/{y}.png')
    this.stateVectors = L.geoJson(usstates, {
      style: function (feature) {
        return self.style
      },
      onEachFeature: function (feature, layer) {
        layer.on('mouseover', function(e) {
          if (feature.properties.ID < 90) {
          var hovertext = feature.properties.name
          $('.geom-hover').html(hovertext)
          $('.geom-hover').show()
          }
        })
        layer.on('mouseout', function(e) {
          $('.geom-hover').html('')
          $('.geom-hover').hide()
        })
        layer.on('click', function(x) {
          if (feature.properties.ID < 90) {
            var activegeo = _.clone(self.model.get('activegeo'))
            var geos = _.clone(self.model.get('activegeo')[self.model.get('compare')])
            if (_.contains(geos, feature.properties.ID)) {
              geos = _.without(geos, feature.properties.ID)
            } else {
              geos.push(feature.properties.ID)
            }
            geos = _.union(geos, App.Model.get('defaultgeos')[App.Model.get('compare')])
            activegeo['states'] = geos
            self.model.set({'activegeo': activegeo})
            self.update()
          }
        })
      }
    })
    this.stategroup = L.layerGroup([this.stateVectors, stateTiles])

    this.metroVectors = L.geoJson(metros, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, self.geojsonMarkerOptions)
      },
      onEachFeature: function (feature, layer) {
        layer.on('mouseover', function(e) {
          var hovertext = feature.properties.name
          $('.geom-hover').html(hovertext)
          $('.geom-hover').show()
        })
        layer.on('mouseout', function(e) {
          $('.geom-hover').html('')
          $('.geom-hover').hide()
        })
        layer.on('click', function(x) {
          var activegeo = _.clone(self.model.get('activegeo'))
          var geos = _.clone(self.model.get('activegeo')[self.model.get('compare')])
          if (_.contains(geos, feature.properties.ID)) {
            geos = _.without(geos, feature.properties.ID)
          } else {
            geos.push(feature.properties.ID)
          }
          geos = _.union(geos, App.Model.get('defaultgeos')[App.Model.get('compare')])
          activegeo['metros'] = geos
          self.model.set({'activegeo': activegeo})
          self.update()
        })
      }
    })
    this.metrogroup = L.layerGroup([this.metroVectors, stateTiles])

    this.layerHash = {
      'counties': self.countyVectors,
      'states': self.stateVectors,
      'metros': self.metroVectors
    }
    this.switchLayer()
  },
  addGeoFromList: function(e) {
    var self = this
    var $target = $(e.target)
    var geocode = parseInt($target.attr('id'))

    var activegeo = self.model.get('activegeo')
    var geos = activegeo[self.model.get('compare')]
    if (_.contains(geos, geocode)) {
      geos = _.without(geos, geocode)
    } else {
      geos.push(geocode)
    }
    activegeo[self.model.get('compare')] = geos
    this.model.set({activegeo: activegeo})
    this.model.trigger('change')
    this.model.trigger('change:activegeo')
  },
  switchGeo: function(event) {
    var $target = $(event.target)
    var compare = $target.attr('id')
    this.model.set({compare: compare})
    this.model.trigger('change:done')
  },
  switchLayer: function() {
    var compare = this.model.get('compare')
    $('#map-tools button').removeClass('active')
    $('.map-tool#' + compare ).addClass('active')
    this.map.removeLayer(this.metrogroup)
    this.map.removeLayer(this.stategroup)
    this.map.removeLayer(this.countygroup)
    this.map.removeLayer(this.countylabels)
    if (compare === 'counties') {
      this.map.setView(this.countycenter, 7, {animate:false})
      this.map.addLayer(this.countygroup)
      this.map.addLayer(this.countylabels)
      this.countylabels.getContainer().style['pointer-events'] = 'none'
      this.topPane.appendChild(this.countylabels.getContainer())
      this.countylabels.setZIndex(9)
      this.map.options.minZoom=6
    } else if (compare === 'states') {
      this.map.addLayer(this.stategroup)
      this.map.dragging.enable()
      this.map.options.minZoom=3
      this.map.setView(this.statecenter, 3, {animate:false})
    } else if (compare === 'metros') {
      this.map.addLayer(this.metrogroup)
      this.map.dragging.enable()
      this.map.options.minZoom=3
      this.map.setView(this.statecenter, 3, {animate:false})
    }
    this.makeGeoList(this.layerHash[compare])
    this.update()
  },
  makeGeoList: function(geolayer) {
    var table = '<div class="inner"><table>'
    var idx = 0
    geolayer.eachLayer(function (layer) {
      if (idx % 2 == 0) {
        table += '<tr>'
      }
      table += '<td>'
      table += '<a id="' + layer.feature.properties.ID + '" class="btn btn-default btn-small geolistBtn" type="button">' + layer.feature.properties.name + '</a>'
      table += '</td>'
      if (idx % 2 != 0) {
        table += '</tr>'
      }
      idx++
    })
    table += '</table></div>'
    $('#geolist').html(table)
  },
  reset: function() {
    var activegeo = _.clone(this.model.get('activegeo'))
    activegeo[this.model.get('compare')] = _.clone(this.model.get('defaultgeos')[this.model.get('compare')])
    this.model.set({activegeo: activegeo})
    this.update()
  },
  selectAll: function() {
    var activegeo = this.model.get('activegeo')
    activegeo[this.model.get('compare')] = []
    this.model.set({activegeo: activegeo})
    this.model.trigger('change:activegeo')
  },
  list: function() {
    if (this.model.get('list_picker')) {
      $('#geolist').hide()
      $('#map').show()
      $('#geolist').css('overflow-y', 'hidden')
      $('#list').removeClass('active')
    } else {
      $('#map').hide()
      $('#geolist').show()
      $('#geolist').css('overflow-y', 'scroll')
      $('#list').addClass('active')
    }
    this.model.set('list_picker', !this.model.get('list_picker'))
  }
})
