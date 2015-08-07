var fs = require('fs'),
  _ = require('underscore');

function makeCriteria(){
  fs.readFile('criteria.json', function (err, data) {
    if (err) throw err;
    var criteria = JSON.parse(data);
    var codeNumber = 1;
    _.each(criteria.category, function(category, key, list){
      _.each(category.subcategory, function(subcategory, key, list){
        _.each(subcategory.criteria, function(criteria, key, list){
          var codeString = '000' + codeNumber;
          codeString = 'C' + codeString.substring(codeString.length-3, codeString.length);
          criteria.code = codeString;
          codeNumber += 1;
        });
      });
    });
    fs.writeFile('criteria2.json', JSON.stringify(criteria), function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    });
  });
}

function makeCodes() {
  fs.readFile('codes.json', function (err, data) {
    if (err) throw err;
    var tables = JSON.parse(data);
    var codeNumber = 1;
    _.each(tables, function(table, key, list){
      var codeString = '000' + codeNumber;
      codeString = 'C' + codeString.substring(codeString.length-3, codeString.length);
      table.code = codeString;
      codeNumber += 1;
    });
    fs.writeFile('codes2.json', JSON.stringify(tables), function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    });
  });
}

function setTables(){
  fs.readFile('codes.json', function (err, data) {
    var codes = JSON.parse(data);
    fs.readFile('criteria.json', function (err, data) {
      var criteria = JSON.parse(data);
      _.each(codes, function(col, idx){
        var code = col.code;
        _.each(criteria.category, function(category, key, list){
          _.each(category.subcategory, function(subcategory, key, list){
            var table = subcategory.table;
            _.each(subcategory.criteria, function(criteria, key, list){
              if(criteria.code === code) col.table = table;
            });
          });
        });
      });
      fs.writeFile('codes2.json', JSON.stringify(codes), function (err) {
        if (err) throw err;
        console.log('It\'s saved!');
      });
    });
  });
}

function metroCodes() {
  fs.readFile('data/metrocodes.json', function (err, data) {
    var codes = JSON.parse(data);
    fs.readFile('data/metros.json', function (err, data) {
      var metros = JSON.parse(data);
      _.each(metros.features, function(feature){
        var name = codes[feature.properties.ID].replace(" metro", "");
        feature.properties.name = name;
        //console.log(feature, codes[feature.properties.ID]);
      });
      fs.writeFile('data/metros2.json', JSON.stringify(metros), function (err) {
        if (err) throw err;
        console.log('It\'s saved!');
      });
    });
  });
}

function getTables(){
  var uids = [];
  fs.readFile('data/codes.json', function (err, data) {
    var codes = JSON.parse(data);
    _.each(codes, function(code){
      uids.push(code.uid);
    })
    uids = _.uniq(uids);
    console.log(uids);
  });
}

getTables();


