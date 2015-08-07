window.App.FooterView = Backbone.View.extend({
  template: App.templates['public/templates/footer.handlebars'],
  initialize: function() {
    this.render()
  },
  render: function() {
    this.$el.html(this.template())
  }
})
