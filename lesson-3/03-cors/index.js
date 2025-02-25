import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.send({ message: 'Hello, World!' });
});

app.post('/', (req, res) => {
  res.send('POST');
});

app.listen(8080, () => {
  console.log('Server started on port 8080');
});
