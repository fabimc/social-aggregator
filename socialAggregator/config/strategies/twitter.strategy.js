var passport = require('passport')
var TwitterStrategy = require('passport-twitter').Strategy
var User = require('../../models/userModel')

module.exports = function () {
  passport.use(new TwitterStrategy({
    consumerKey: 'KrKQmwa0nFVQzOGzRO5T2pl2e',
    consumerSecret: '60gqp15LIE7JRZ716NSvWxhQwwynVq5bDkgCxEAcaVkI3INysq',
    callbackURL: 'http://localhost:3000/auth/twitter/callback',
    passReqToCallback: true
  },
  function (req, token, tokenSecret, profile, done) {
    console.log('twitter: token, tokenSecret', token, tokenSecret)
    if (req.user) {
      if (req.user.google) {
        console.log('google')
        var query = { 'google.id': req.user.google.id }
      } else if (req.user.facebook) {
        var query = { 'facebook.id': req.user.facebook.id }
      }

      User.findOne(query, function (error, user) {
        if (user) {
          user.twitter = {
            id: profile.id,
            token: token,
            tokenSecret: tokenSecret
          }
          user.save()
          done(null, user)
        }
      })
    } else {
      var query = {
        'twitter.id': profile.id
      }

      User.findOne(query, function (error, user) {
        if (user) {
          console.log('found')
          done(null, user)
        } else {
          console.log('not found')
          var user = new User({
            image: profile._json.profile_image_url,
            displayName: profile.displayName,
            twitter: {
              id: profile.id,
              token: token,
              tokenSecret: tokenSecret
            }
          })
          user.save()
          done(null, user)
        }
      })
    }
  }))
}
