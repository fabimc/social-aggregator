var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth20').Strategy
var User = require('../../models/userModel')

module.exports = function () {
  passport.use(new GoogleStrategy({
    clientID: '208135923579-o622al3gqqe20qan79d2v1jucfu2livt.apps.googleusercontent.com',
    clientSecret: '3tuQYZpxOKnK3ZUSX3GN9Wpg',
    callbackURL: 'http://localhost:3000/auth/google/callback'},
    function (req, accessToken, refreshToken, profile, done) {
      if (req.user) {
        if (req.user.twitter) {
          console.log('twitter')
          var query = { 'twitter.id': req.user.twitter.id }
        } else if (req.user.facebook) {
          var query = { 'facebook.id': req.user.facebook.id }
        }

        User.findOne(query, function (error, user) {
          if (user) {
            user.google = {
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
          'google.id': profile.id
        }

        User.findOne(query, function (error, user) {
          if (user) {
            console.log('found')
            done(null, user)
          } else {
            console.log('not found')
            var user = new User({
              email: profile.emails[0].value,
              image: profile._json.profile_image_url,
              displayName: profile.displayName,
              google: {
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
