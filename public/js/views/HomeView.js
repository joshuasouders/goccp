
window.App.HomeView = Backbone.View.extend({
  events: {
    'click .geo-chooser-btn.counties': 'launchCounties',
    'click .geo-chooser-btn.states': 'launchStates',
    'click .geo-chooser-btn.metros': 'launchMetros'
  },
  template: App.templates['public/templates/home.handlebars'],
  initialize: function() {
    this.render()
  },
  render: function() {
    this.$el.html(this.template())
  },
  launchCounties: function(e) {
    window.location = '#compare/counties/set/overview'
  },
  launchStates: function(e) {
    window.location = '#compare/states/set/overview'
  },
  launchMetros: function(e) {
    window.location = '#compare/metros/set/overview'
  }
})
