const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev')); // use in development version
app.use(bodyParser.json());

app.all('/dishes', (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text-plain');
  next(); // continue to process and pass the parameters to next request
})

// process dishes
// continue to process with get method
app.get('/dishes', (req, res, next) => {
  res.end('Will send all the dishes to you!');
});

// continue to process with post method
app.post('/dishes', (req, res, next) => {
  res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
});

// continue to process with put method
app.put('/dishes', (req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /dishes');
});

// continue to process with get method
app.delete('/dishes', (req, res, next) => {
  res.end('Deleting all the dishes!');
});

// process dish with id
// continue to process with get method
app.get('/dishes/:dishId', (req, res, next) => {
  res.end('Will send all the dish: ' + req.params.dishId + ' to you!');
});

// continue to process with post method
app.post('/dishes/:dishId', (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/' + req.params.dishId);
});

// continue to process with put method
app.put('/dishes/:dishId', (req, res, next) => {
  res.write('Updating the dish: ' + req.params.dishId + '\n');
  res.end('Will update the dish: ' + req.body.name + ' with details' + req.body.description);
});

// continue to process with get method
app.delete('/dishes/:dishId', (req, res, next) => {
  res.end('Deleting dish: ' + req.params.dishId);
});



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
