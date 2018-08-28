const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, redis } = require('../../db/init');

const route = require('express').Router();

route.post('/', (req, res) => {
  const { start } = req.body;

  query_items(start).then((data) => {
    res.send({status: 200, data: data ? data.rows : []});
  }).catch((err) => {
    console.log(err);
    res.send({status: 500, message: 'Internal Server Error'});
  });
});

const query_items = (start) => {
  return new Promise((resolve, reject) => {
    db.connect().then((client) => {
      client.query(
        'SELECT i.item_name, i.short_descript, i.image_url, i.price FROM items i ' +
        'JOIN stock s ON i.id = s.item_id WHERE s.quantity > 0 ORDER BY i.item_name LIMIT 10 OFFSET $1', [start]
      ).then((data) => {
        client.release();
        resolve(data);
      }).catch((e) => {
        client.release();
        reject(e);
      });
    }).catch((e) => {
      reject(e)
    });
  });
}

route.post('/item', (req, res) => {
  const { name } = req.body;

  query_item(name).then((data) => {
    res.send({status: 200, data: data ? data.rows : []});
  }).catch((err) => {
    console.log(err);
    res.send({status: 500, message: 'Internal Server Error'});
  });
});

const query_item = (name) => {
  return new Promise((resolve, reject) => {
    db.connect().then((client) => {
      client.query(
        'SELECT i.item_name, i.long_descript, i.image_url, i.price, s.quantity FROM items i ' +
        'JOIN stock s ON i.id = s.item_id WHERE i.item_name = $1', [name]
      ).then((data) => {
        client.release();
        resolve(data);
      }).catch((e) => {
        client.release();
        reject(e);
      });
    }).catch((e) => {
      reject(e)
    });
  });
}

module.exports = route;
