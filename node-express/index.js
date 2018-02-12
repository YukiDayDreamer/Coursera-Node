const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev')); // use in development version
app.use(bodyParser.json());
app.use('/dishes', dishRouter); // any request coming to that /dishes endpoint will be handled by dishRouter
app.use('/promotions', promoRouter); // same as promoRouter
app.use('/leaders', leaderRouter); // same as leaderRouter

app.use(express.static(__dirname + '/public')); // host static HTML files under public folder

app.use((req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<html><body><h1>This is an Express Server</h1></body></html>');
  return;
})

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
