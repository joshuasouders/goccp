//App: global namespace

$(function() {
  App.Model = new App.Compare()
  load(function() {
    App.router = new App.Router()
    Backbone.history.start()
  })

  function load(next) {
    $.get('api/presets', function(presets) {
      App.Model.set('presets', presets)
      $.get('api/tables', function(tables) {
        App.Model.set('tableInfo', tables)
        next()
      })
    })
  }
})
