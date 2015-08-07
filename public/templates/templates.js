this["App"] = this["App"] || {};
this["App"]["templates"] = this["App"]["templates"] || {};

this["App"]["templates"]["public/templates/addchart-template.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"chartitle\">\n  <div class=\"title\">\n    <h3>Add New Chart</h3>\n    <div class=\"subtitle\"></div>\n  </div>\n</div>\n<div class=\"chart-container\">\n  <div class=\"new chart\">\n    <div class=\"toggle\"><i class=\"icon-plus\"></i></div>\n    <form class=\"form-search\">\n      <input type=\"text\" class=\"input-medium search-query\">\n      <button type=\"submit\" class=\"add btn\">Add</button>\n    </form>\n  </div>\n</div>\n";
  });

this["App"]["templates"]["public/templates/chart-template.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"chart-wrap\">\n<div class=\"chartitle\">\n  <div class=\"title\">\n    <h3>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h3>\n    <div class=\"settings-toggle\">\n      <i class=\"icon-reorder\"></i>\n    </div>\n    <div class=\"subtitle\">";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1);
  if (helper = helpers.category) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.category); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n  </div>\n  <div class=\"settings-container\">\n    <div class=\"settings\">\n      <div class=\"btn-group btn-group-sm\">\n        <!-- <button class=\"remove btn btn-mini\"><i class=\"icon-remove\"></i></button> -->\n        <button class=\"chartTool embed btn btn-default\" data-toggle=\"tooltip\" title=\"Embed this chart\"><i class=\"icon-code\"></i></button>\n        <button class=\"chartTool data-table btn btn-default\" data-toggle=\"tooltip\" title=\"Table View\"><i class=\"icon-table\"></i> </button>\n        <button class=\"chartTool download btn btn-default\" data-toggle=\"tooltip\" title=\"Download Data\"><i class=\"icon-cloud-download\"></i></button>\n        <button class=\"chartTool sortDesc btn btn-default\" data-toggle=\"tooltip\" title=\"Sort Descending\"><i class=\"icon-chevron-down\"></i></button>\n        <button class=\"chartTool sortAsc btn btn-default\" data-toggle=\"tooltip\" title=\"Sort Ascending\"><i class=\"icon-chevron-up\"></i></button>\n        <button class=\"chartTool sortAlpha btn btn-default\" data-toggle=\"tooltip\" title=\"Sort Alphabetically\"><i class=\"icon-sort-by-alphabet\"></i></button>\n      </div>\n    </div>\n    <div class=\"embed-container\">\n      Copy and paste this HTML into your website or blog:\n      <textarea id=\"codeEmbed\" class=\"code\" cols=\"60\" rows=\"4\" readonly=\"\">&lt;iframe width='500' height='300' frameBorder='0' src=''&gt;&lt;/iframe&gt;</textarea>\n    </div>\n  </div>\n</div>\n<div class=\"chart-container\">\n  <div class=\"loader loading\">\n    <img src=\"img/loader.gif\" />\n  </div>\n  <div class=\"error\">Error Loading Data</div>\n  <div class=\"chart\" id=\"id_";
  if (helper = helpers.code) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.code); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></div>\n  <div class=\"more-info\">No additional information.</div>\n</div>\n<div class=\"chart-source\">\n  <p class=\"source\"></p>\n  <div class=\"info\"><i class=\"icon-info-sign\"></i></div>\n</div>\n</div>";
  return buffer;
  });

this["App"]["templates"]["public/templates/dashboard-template.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"top-row\">\n  <div class=\"row\">\n    <div class=\"col-sm-6\">\n      <div id=\"map-container\"></div>\n    </div>\n    <div class=\"col-sm-6\">\n      <div id=\"menu-container\">\n      <div class=\"intro\"></div>\n        <p>Choose a set of statistics:</p>\n        <div class=\"preset-list\"></div>\n      </div>\n    </div>\n  </div>\n</div>\n<div id=\"middle-row\">\n  <div class=\"row\">\n    <div class=\"col-sm-8\">\n      <div id=\"blurb-container\">\n        <div id=\"blurb\"></div>\n      </div>\n    </div>\n    <div class=\"col-sm-4\">\n      <div class=\"chart-settings\">\n        <h4>Chart Tools</h4>\n        <div class=\"chart-tools-one btn-group btn-group-sm\">\n          <button class=\"data-table-all btn btn-default\" data-toggle=\"tooltip\" title=\"Table View\">View Table</button>\n          <button class=\"download-all btn btn-default\" data-toggle=\"tooltip\" title=\"Download Data\">Download All</button>\n        </div>\n        <div class=\"chart-tools-two btn-group btn-group-sm\">\n          <button class=\"chartTool all-sortDesc btn btn-default\" data-toggle=\"tooltip\" title=\"Sort Descending\"><i class=\"icon-chevron-down\"></i></button>\n          <button class=\"chartTool all-sortAsc btn btn-default\" data-toggle=\"tooltip\" title=\"Sort Ascending\"><i class=\"icon-chevron-up\"></i></button>\n          <button class=\"chartTool all-sortAlpha btn btn-default\" data-toggle=\"tooltip\" title=\"Sort Alphabetically\"><i class=\"icon-sort-by-alphabet\"></i></button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n<div id=\"charts\">\n  <div class=\"row\"></div>\n</div>\n";
  });

this["App"]["templates"]["public/templates/footer.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"footer\">\n  <div class=\"container-fluid\">\n    <div class=\"row-fluid\">\n      <div class=\"span6\">\n          <p>Powered by open data on <a href=\"https://data.maryland.gov\">data.maryland.gov</a>.</p>\n          <p>Site By <a href=\"http://esrgc.org\"><img class=\"esrgc\" src=\"img/esrgc_logo.png\" /></a></p>\n      </div>\n      <div class=\"span6\">\n        <p><a href=\"http://choosemaryland.org\">www.choosemaryland.org</a></p>\n        <p><img src=\"img/MarylandofOpportunityforFooter.png\" /></p>\n      </div>\n    </div>\n  </div>\n</div>";
  });

this["App"]["templates"]["public/templates/geolist-template.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n   <a id=\""
    + escapeExpression(((stack1 = (depth0 && depth0.ID)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"btn btn-default btn-small geolistBtn\" type=\"button\">"
    + escapeExpression(((stack1 = (depth0 && depth0.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\n  ";
  return buffer;
  }

  buffer += "<div class=\"inner\">\n  ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.geos), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n";
  return buffer;
  });

this["App"]["templates"]["public/templates/header.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"header\">\n  <h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n</div>";
  return buffer;
  });

this["App"]["templates"]["public/templates/home.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"row\">\n  <div class=\"col-md-12\">\n    <div class=\"main-intro-container\">\n      <div class=\"main-intro\">\n        <p class=\"lead\"><strong>Welcome to the Maryland DBED Data Explorer.</strong></p>\n        <p class=\"lead\">Get to know Maryland better with the easy-to-use Data Explorer. Compare information on education, the economy, taxes and quality of life on different locations within Maryland or with other states and metro areas. </p>\n      </div>\n    </div>\n  </div>\n</div>\n<div class=\"row\">\n  <div class=\"geo-chooser\">\n    <div class=\"col-md-4\">\n      <div class=\"geo-chooser-btn counties\">\n        <h4>Compare Counties</h4>\n        <img src=\"img/county8.png\" />\n        <p>Compare Maryland's 24 major jurisdictions, including 23 counties and the City of Baltimore.</p>\n      </div>\n      \n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"geo-chooser-btn states\">\n        <h4>Compare States</h4>\n        <img src=\"img/state8.png\" />\n        <p>Compare Maryland with the other states and the District of Columbia.</p>\n      </div>\n      <div class=\"stat-list\" id=\"states\"></div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"geo-chooser-btn metros\">\n        <h4>Compare Metros</h4>\n        <img src=\"img/metro8.png\" />\n        <p>Compare the Baltimore and Washington, D.C. metropolitan areas with other top 50 metro areas.</p>\n      </div>\n      <div class=\"stat-list\" id=\"metros\"></div>\n    </div>\n  </div>\n</div>\n<div class=\"row\">\n  <div class=\"col-md-12\">\n    <div class=\"description\">\n      <p class=\"lead\">To begin, choose to compare counties, states, or metropolitan areas. Select areas of interest from the map, list, or choose the select all button. Select a set of statistics to compare and explore the interactive charts.</p>\n      <p class=\"lead\">Use the Chart Tools to customize or to download all the charts on the current page. Additional tools are available for each chart and can be accessed by opening the chart menu in the upper right. Here users can customize or download the individual chart, or choose to embed the chart into another website. Source information for each chart is available at the bottom of each chart. Tips and other helpful information can be found by selecting the <i class=\"icon-info-sign\"></i> icon on each chart. </p>\n      <p class=\"lead\">Data in this dashboard is available for download, and is available on <a href=\"https://data.maryland.gov/\">Maryland's Open Data Portal.</a> </p>\n    </div>\n  </div>\n</div>\n";
  });

this["App"]["templates"]["public/templates/map-template.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"map-tools-container\">\n  <div id=\"map-tools\">\n  <div class=\"compare\">\n    <div class=\"btn-group btn-group-sm \">\n      <button id=\"counties\" class=\"map-tool btn btn-default active\">Counties</button>\n      <button id=\"states\" class=\"map-tool btn btn-default\">States</button>\n      <button id=\"metros\" class=\"map-tool btn btn-default\">Metros</button>\n    </div>\n  </div>\n  <div class=\"tools\">\n    <div class=\"btn-group btn-group-sm \">\n      <button id=\"reset\" class=\"btn btn-default\">Reset</button>\n      <button id=\"selectAll\" class=\"btn btn-default\">Select All</button>\n      <button id=\"list\" class=\"btn btn-default\">List</button>\n    </div>\n  </div>\n</div>\n<div id=\"map\"></div>\n<div id=\"geolist\">\n  List of geos\n</div>\n";
  });

this["App"]["templates"]["public/templates/presetlist-template.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <a href=\"#"
    + escapeExpression(((stack1 = (depth0 && depth0.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"btn btn-default preset\">"
    + escapeExpression(((stack1 = (depth0 && depth0.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\n  <!-- <li><a class=\"preset active\" href=\"#"
    + escapeExpression(((stack1 = (depth0 && depth0.key)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = (depth0 && depth0.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a></li> -->\n";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, (depth0 && depth0.categories), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });