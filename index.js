"use strict";

const
  config = {};
  config.env = process.env.NODE_ENV == 'production' ? require('./config/env/production') : require('./config/env/development');

const
  express = require("express")
;

const app = express();

app.use(express.static('public'));

app.get('/', (req, res, next) => {
  res.send('Hello world');
});

app.listen(config.env.port, () => {
  console.log("Server running on port: " + config.env.port);
});
