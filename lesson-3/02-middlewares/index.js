import express from 'express';

const app = express();

// app.use((req, res, next) => {
//   console.log("Middleware 3");
//   next();
// });

// app.use((req, res, next) => {
//   console.log("Middleware 1");
//   next();
// });

// app.use((req, res, next) => {
//   console.log("Middleware 2");
//   next();
// });

function checkAPIKey(req, res, next) {
  const { key } = req.query;

  if (key !== '123456789') {
    return res.status(401).send({ message: 'Please provide API key' });
  }

  next();
}

function middleware(req, res, next) {
  console.log('Middleware');
  next();
}

app.use(checkAPIKey);

const motherMiddleware = [checkAPIKey, middleware, middleware, middleware];

app.get('/', motherMiddleware, (req, res) => {
  res.send('Hello, Middleware)');
});

// app.use((req, res, next) => {
//   console.log("Middleware 4");
//   next();
// });

app.post('/', (req, res) => {
  res.send('POST');
});

app.listen(8080, () => {
  console.log('Server started on port 8080');
});
