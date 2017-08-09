var express = require('express')
var router = express.Router()
var facebook = require('../services/facebook')('389536961443022', '932538295ca194ba79442fac0da3731d')
var twitter = require('../services/twitter')('KrKQmwa0nFVQzOGzRO5T2pl2e', '60gqp15LIE7JRZ716NSvWxhQwwynVq5bDkgCxEAcaVkI3INysq')

router.use('/', function (req, res, next) {
  if (!req.user) {
    res.redirect('/')
  }
  next()
})

router.use('/', function (req, res, next) {
  if (req.user.twitter) {
    twitter.getUserTimeLine(
      req.user.twitter.token,
      req.user.twitter.tokenSecret,
      req.user.twitter.id,
      function (results) {
        req.user.twitter.lastPost = (results && results.length) ? results[0].text : ''
        next()
      }
    )
  }
})

router.get('/', function (req, res, next) {
  if (req.user.facebook) {
    facebook.getImage(req.user.facebook.token, function (results) {
      req.user.facebook.image = results.url

      facebook.getFriends(req.user.facebook.token, function (results) {
        req.user.facebook.friends = results.total_count
        res.render('users', { user: req.user })
      })
    })
  } else {
    res.render('users', { user: req.user })
  }
})

module.exports = router
