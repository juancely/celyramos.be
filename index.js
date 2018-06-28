"use strict";

const
  config  = require('./config/config')
;

const
  http    = require("http")
, https   = require("https")
, express = require("express")
, fs      = require("fs")
;

const app = express();

      app.use(express.static('www'));
      app.set('view engine', 'ejs');

const setServer = async () => {
  let server = null;
  if(config.env.name == "production"){
    server = https.createServer(
      {
        key: fs.readFileSync('./csr.pem', 'utf8')
      , cert: fs.readFileSync('./server.crt', 'utf8')
      }
      , app
    );
  }else{
    server = http.createServer(app);
  }

  return await server;
}

app
  .get('/', (req, res, next) => {
    res.render('index',{
      title: "CelyRamos"
    });
  })
  .get('/about', (req, res, next) => {
    res.render('about',{
      title: "About"
    });
  })
  .get('/contact', (req, res, next) => {
    res.render('contact',{
      title: "Contact"
    });
  })

  .post('/contact', (req, res, next) => {
    res.render('contact',{
      title: "Contact"
    });
  })
;


setServer().then(async (server)=>{
  if(config.env.name == "production"){
    server.listen(config.env.port, () => {
      console.log("HTTPS Server running on port: " + config.env.port);
    });
  }else{
    server.listen(config.env.port, () => {
      console.log("HTTP Server running on port: " + config.env.port);
    });
  }
});
