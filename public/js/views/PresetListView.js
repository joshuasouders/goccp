window.App.PresetList = Backbone.View.extend({
  events: {
    'click .preset': 'preset'
  },
  template: App.templates['public/templates/presetlist-template.handlebars'],
  initialize: function() {
    this.render()
  },
  render: function() {
    var self = this
    var attributes = this.model.toJSON()
    var compare = this.model.get('compare')
    var presets = _.where(this.model.get('presets'), {compare: compare})[0]
    this.$el.html(this.template(presets))
    return this
  },
  preset: function(e) {
    e.preventDefault()
    var $target = $(e.target)
    var key = $target.attr('href').replace('#', '')
    this.model.set({key: key})
    this.model.trigger('change:done')
  }
})
