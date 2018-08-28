const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, redis, jwthash } = require('../../db/init');
const authenticate = require('../../mdw/authenticate');

const route = require('express').Router();

route.post('/auth', authenticate, function(req, res) {
  res.send({status: 200});
});

route.post('/login', function(req, res) {
  const { username, password } = req.body;

  query_by_username(username).then((data) => {
    const user = data.rows.find((r) => r.user_name === username)
    if(user) {

      bcrypt.compare(password, user.password, function(err, equal) {
        if(equal) {
          const token = jwt.sign({ foo: user.password }, jwthash);
          const usertokenkey = user.user_name + "_" + "authtoken";
          redis.set(usertokenkey, token, 'EX', 86400) //Expires after 1 day
          res.send({status: 200, token, username: user.user_name, firstname: user.first_name, lastname: user.last_name});
        } else {
          res.send({status: 400, message: "Incorrect password"});
        }
      });

    } else {
      res.send({status: 404, message: "User doesn't exist"});
    }
  }).catch((err) => {
    console.log(err);
  });

});

const query_by_username = (username) => {
  return new Promise((resolve, reject) => {
    db.connect().then((client) => {
      client.query('SELECT user_name, password, first_name, last_name FROM users WHERE user_name IN ($1) LIMIT 1', [username]).then((res) => {
        client.release();
        resolve(res);
      }).catch((e) => {
        client.release();
        reject(e);
      });
    }).catch((e) => {
      reject(e)
    });
  })
}

route.post('/create', (req, res) => {
  const { username, password, firstname, lastname } = req.body;



  res.send({status: 200});
});

module.exports = route;
