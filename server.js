const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();
const { PORT, FILE_PATH } = process.env;
const app = express();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.get('/', (req, res) => {
  console.log('route: /');
  res.sendStatus(200);
});

app.get('/data', (req, res) => {
  console.log('route: /data');
  const latLngArr = JSON.parse(fs.readFileSync(FILE_PATH));
  console.log(latLngArr);
  res.json(200);
});
