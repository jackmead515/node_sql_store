global.__basedir = __dirname;
console.log("\n\n")

const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');

const { init } = require('./db/init');
const services = require('./routes');

var app = express();

const host = 'www.nodestore.com';
const port = 443;

//############# MIDDLEWARE
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
//########################

//############### INTERFACE
const staticRoute = express.static(path.join(__dirname, 'interface/build'));
app.use('/', staticRoute);
app.use('/*', staticRoute);
app.use('/admin', staticRoute);
app.use('/admin/*', staticRoute);
//########################

//############## SERVICES
app.use('/api/auth', services.auth);
app.use('/api/store', services.store);
app.use('/api/user', services.user);
app.use('/api/order', services.order);
//######################

https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
  passphrase: 'password1!'
}, app).listen({port: port, host: host}, () => {
  console.log("node_sql_store booted")
});
