window.App.HeaderView = Backbone.View.extend({
  template: App.templates['public/templates/header.handlebars'],
  initialize: function() {
    this.render()
  },
  render: function() {
    this.$el.html(this.template())
  }
})
