"use strict";

const
  config  = require('./config/config')
;

const
  http        = require("http")
, https       = require("https")
, express     = require("express")
, bodyParser  = require('body-parser')
, fs          = require("fs")
, rp          = require('request-promise')
;

const app = express();

      app.use(express.static('www'));
      app.set('view engine', 'ejs');
      app.use(bodyParser.json());       // to support JSON-encoded bodies
      app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
      }));

const setServer = async () => {
  let server = null;
  if(config.env.name == "production"){
    server = https.createServer(
      {
        key: fs.readFileSync('/etc/ssl/private/apache-selfsigned.key', 'utf8')
      , cert: fs.readFileSync('/etc/ssl/certs/apache-selfsigned.crt', 'utf8')
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
    res.render('contact',{
      title: "Contact"
    });
  })
  .post('/', (req, res, next) => {
    res.render('contact',{
      title: "Contact"
    });
  })

  .get('/hubspot/token', (req, res, next) => {
    if(req.query && req.query.code){
      res.render('hubspot/token-request-form', {
        authcode: req.query.code
      });
    }else{
      res.redirect('/hubspot/auth/initiate-oauth');
    }
  })
  .post('/hubspot/token', async (req, res, next) => {
    if(req.body && req.body.authcode){
      await rp({
        method: 'POST'
      , uri: 'https://api.hubapi.com/oauth/v1/token'
      , form: {
          grant_type: 'authorization_code'
        , client_id: 'd6560fb5-ae62-440e-914d-14b038b383d3'
        , client_secret: '27bcad28-465c-482d-9686-af700499580a'
        , redirect_uri: 'https://celyramos.be/hubspot/token'
        , code: req.body.authcode
        }
      , json: true
      })
      .then(async data => {
        await res.json(data);
      })
      .catch(async err => {
        console.log(err);
        await res.json(err);
      })
      ;
    }else{
      res.redirect('/hubspot/auth/initiate-oauth');
    }
  })


  .get('/hubspot/auth/initiate-oauth', (req, res, next) => {
    res.render('hubspot/auth-form');
  })
  .post('/hubspot/auth/initiate-oauth', (req, res, next) => {
    // console.log(req.body);
    if(req.body && req.body.hubspotID){
      // console.log(req.body.hubspotID);
      const
        clientID      = 'd6560fb5-ae62-440e-914d-14b038b383d3'
      , portalID      = req.body.hubspotID
      , scope         = 'contacts'
      , redirect_uri  = 'https://celyramos.be/hubspot/token'
      , uri = 'https://app.hubspot.com/oauth/authorize'
      ;

      res.redirect(uri + '?client_id=' + clientID + '&scope=' + scope + '&redirect_uri=' + redirect_uri);
      res.end();
    }else{
      res.redirect('/hubspot/auth/initiate-oauth');
    }
  })

  .get('/client/clearsource/hubspot/webhook', (req, res, next) => {
    res.send("Clearsource Webhook working !");
    // console.log(req.body, req.query, req.params);
  })
  .post('/client/clearsource/hubspot/webhook', (req, res, next) => {
    if(req.body){
      bullhorn.updateData(req.body);
    }
    res.end();
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
