var fs = require('fs');
var path = require('path');
var getUser= require('../fetcher/api').getUser;
var model = require('./model')();
var User = model.User;
var Tweet = model.Tweet;

var tweet_tmpl = fs.readFileSync(path.normalize(__dirname + '/../views/templates/tweet.jade'), {encoding: 'utf-8'});
var user_tmpl = fs.readFileSync(path.normalize(__dirname + '/../views/templates/user.jade'), {encoding: 'utf-8'});


module.exports = {
  
  // GET: [/]
  index: function(req, res) {
    if (req.xhr) {
      req.tweet = 1;
      console.log('xhr');
      if (req.tweet) {
      console.log('tweet');
        Tweet.find(function(err, tweets) {
          if (err) {
            console.log(err.message);
            res.send({ err: err});
          } else {
            console.log(tweets);
            res.json(tweets);
          }
        });
      }
      // get users
      if (req.user) {
        User.find(function(err, users) {
          if (err) {
            console.log(err.message);
            res.send({ err: err});
          } else {
            res.send({users: users});
          }
        });
      }
    }
    else {
      res.render('index', { 
        title: "recent tweets",
        tweet_tmpl: tweet_tmpl,
        user_tmpl: user_tmpl
      });
    }
  },

  // POST :get tweets or users on page loading
  initData: function(req, res) {
    // get tweets
    if (req.tweet) {
      Tweet.find(function(err, tweets) {
        if (err) {
          console.log(err.message);
          res.send({ err: err});
        } else {
          res.send({tweets: tweets});
        }
      });
    }
    // get users
    if (req.user) {
      User.find(function(err, users) {
        if (err) {
          console.log(err.message);
          res.send({ err: err});
        } else {
          res.send({users: users});
        }
      });
    }
  },

  // POST :find tweets of a specific user [/user/:id]
  user: function(req, res) {
    Tweet.find({user_id: req.uid}, function(err, tweets) {
      if (err) {
        console.log('user: ' + req.name + 'not exist!');
        res.send({err: err});
      } else {
        res.send({tweets: tweets});
      };
    });
  },

  // POST: add a user to watch [/add]
  add: function(req, res) {
    User.find({name: req.name}, function (err, user) {
      if (!user) { 
        getUser(req.name, function(err, user) {
          if (err) {
            console.log(err);
            res.send({err: err});
          } else {
            var newuser = new User({name: req.name, uid: user.id});
            newuser.save(function () {
              res.send({user: newuser});
            });
          }
        });
      } else {
        res.send({user: user});
      }
    });
  },

  // POST: subscribe email to tweets [/subscribe] TODO:
  subscribe: function(req, res) {
  }

}
