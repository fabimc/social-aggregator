var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy
var User = require('../../models/userModel')

module.exports = function () {
  passport.use(new FacebookStrategy({
    clientID: '389536961443022',
    clientSecret: '932538295ca194ba79442fac0da3731d',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    passReqToCallback: true
  },
    function (req, accessToken, refreshToken, profile, done) {
      if (req.user) {
        if (req.user.google) {
          console.log('google')
          var query = { 'google.id': req.user.google.id }
        } else if (req.user.twitter) {
          var query = { 'twitter.id': req.user.twitter.id }
        }

        User.findOne(query, function (error, user) {
          if (user) {
            user.facebook = {
              id: profile.id,
              token: accessToken,
              tokenSecret: refreshToken
            }
            user.save()
            done(null, user)
          }
        })
      } else {
        var query = {
          'facebook.id': profile.id
        }
        User.findOne(query, function (error, user) {
          if (user) {
            console.log('found')
            done(null, user)
          } else {
            console.log('not found')
            var user = new User({
              displayName: profile.displayName,
              facebook: {
                id: profile.id,
                token: accessToken,
                tokenSecret: refreshToken
              }
            })

            user.save()
            done(null, user)
          }
        })
      }
    }
  ))
}
