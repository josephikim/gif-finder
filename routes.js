var express = require('express')
var router = express.Router()

router.get('https://media.giphy.com/media/LIPUdAsE4zNJK/giphy.gif', (req, res, next) => {
  res.redirect('https://media.giphy.com/media/LIPUdAsE4zNJK/giphy.gif');
});

module.exports = routes;