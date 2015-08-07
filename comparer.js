var Compare = require('./lib/Compare').Compare
  , Socrata = require('./lib/Socrata')
  , tableInfo = require('./config/tableInfo.json')
  , uids = require('./config/uids.json')
  , config = require('./config/config')

var socrataDataset = new Socrata.Dataset()
socrataDataset.setHost('https://data.maryland.gov')
socrataDataset.setAppToken(config.socrata.apptoken)

var compare = new Compare({
  tableInfo: tableInfo,
  uids: uids,
  socrataDataset: socrataDataset
})

module.exports = compare