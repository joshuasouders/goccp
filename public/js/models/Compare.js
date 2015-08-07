// App Model to store global app

window.App.Compare = Backbone.Model.extend({
  defaults: {
    title: 'Research Tools: Compare',
    chartsPerRow: 3,
    compare: '',
    tableView: false,
    list_picker: false,
    key: false,
    labels: true,
    presets: [],
    activegeo: {
      'counties': [],
      'states': [20],
      'metros': [12580, 47900]
    },
    defaultgeos: {
      'counties': [],
      'states': [20],
      'metros': [12580, 47900]
    },
    intros: {
      'counties': "<p>Compare Maryland's 24 major jurisdictions on a variety of economic and demographic factors, or create county groups for regional comparison. </p><p>Each area of the State offers unique advantages, from natural resources and transportation infrastructure to workforce skills and availability.</p>",
      'states': "<p>Compare Maryland with the other states and the District of Columbia on a variety of factors relevant to economic development. Maryland ranks among the top states in a number of business-significant factors, including income, college education, and professional and technical workers. The State also offers an excellent quality of life at a reasonable living cost.</p>",
      'metros': "Compare the Baltimore and Washington, D.C. metropolitan areas with other top 50 metro areas."
    }
  },
  initialize: function(){}
})
