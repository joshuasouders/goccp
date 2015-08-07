//DBED Data Explorer
//Author: Frank Rowe, ESRGC, 2014

var express = require('express')
  , errorhandler = require('errorhandler')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , RedisStore = require('connect-redis')(session)
  , config = require('./config/config')

var app = express()

//App Settings
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('mount', config.mount)

//Middleware
app.use(express.static(__dirname + '/public'))
app.use(bodyParser())
app.use(cookieParser())
app.use(session({store: new RedisStore({host: '127.0.0.1', port: 6379}), secret: 'Gbrg2HgqLwYp8G'}))

//Session-persisted message middleware
app.use(function(req, res, next) {
  var err = req.session.error
    , msg = req.session.success
  delete req.session.error
  delete req.session.success
  res.locals.message = ''
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>'
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>'
  next()
})

//Enable CORS
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  next()
})

//Routers
app.use('/', require('./routers/index'))
app.use('/api', require('./routers/apiRouter'))
app.use('/admin', require('./routers/adminRouter'))

module.exports = app

