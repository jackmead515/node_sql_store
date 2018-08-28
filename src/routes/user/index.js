const express = require('express');
const authenticate = require('../../mdw/authenticate');
const { db, redis } = require('../../db/init');

const route = require('express').Router();

route.post('/', authenticate, (req, res) => {
  const { username, token } = req.body;

  get_userinfo(username).then((data) => {
    res.send({status: 200, data: data ? data.rows : []});
  }).catch((err) => {
    console.log(err);
    res.send({status: 500, message: 'Internal Server Error'})
  });
});

const get_userinfo = (username) => {
  return new Promise((resolve, reject) => {
    db.connect().then((client) => {
      client.query('SELECT o.order_time, o.quantity, i.item_name, i.price FROM users u ' +
                   'JOIN orders o ON u.id = o.user_id ' +
                   'JOIN items i ON o.item_id = i.id ' +
                   'WHERE u.user_name = $1 ' +
                   'ORDER BY o.order_time', [username]).then((res) => {
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

module.exports = route;
