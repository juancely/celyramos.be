"use strict";

const
  config  = require('./config/config')
, routes  = require('./config/routes')
;

const
  http        = require("http")
, express     = require("express")
, bodyParser  = require('body-parser')
, fs          = require("fs")
;

const app = express();

      app.use(express.static('www'));
      app.set('view engine', 'ejs');
      app.use(bodyParser.json());       // to support JSON-encoded bodies
      app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
      }));

      app.use(routes);

const server = http.createServer(app);

server.listen(config.port, () => {
  console.log("HTTP Server running on port: " + config.port);
});
