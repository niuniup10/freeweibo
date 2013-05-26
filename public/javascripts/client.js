$(function () {
  var jade = require('jade');
  var tweetTmp = jade.compile($('#tweet-template').html());
  var userTmp = jade.compile($('#user-template').html());

  $.post('/', {tweet: 1}, function(tweets) {
    for (var i = 0; i <tweets.length; i++) {
      insertTweet(tweets[i]);
    };
  }, 'json');

  $.post('/', {user: 1}, function(users) {
    for (var i = 0; i < users.length; i++) {
      insertUser(users[i]);
    };
  }, 'json');

  $('.tweets').on('click', '.thumb_img', function() {
    $(this).hide();
    $(this).next().show();
  });

  $('.tweets').on('click', '.middle_img', function() {
    $(this).hide();
    $(this).prev().show();
  });

  function insertTweet(tweet) {
    tweet.create_at = (new Date(tweet.create_at)).toLocaleString();

    var $tweet = $(tweetTmp({tweet: tweet})).appendTo('.tweets');
    var $main_text = $tweet.find('.text > span');

    $main_text.html($main_text.html().replace(/(http:\/\/[\/.\w]*)/g, '<a href="$1" target="_blank">$1</a>'));
    if (tweet.status) {
      $tweet.addClass('filtered');
    }
  }

  function insertUser(user) {
    $('.users').append(userTmp({user: user}));
  }
})
