"use strict";

module.exports = {
  env: process.env.NODE_ENV == 'production' ? require('./env/production') : require('./env/development')
, routes: require('./routes')
}
