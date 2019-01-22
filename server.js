var express = require('express')
var app = express()
var path = require('path');
var routes = require('./routes')
const port = 3000

app.use("/public", express.static(__dirname + '/public'));

app.use(routes)


// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.listen(port, () => console.log(`App listening on port ${port}!`))