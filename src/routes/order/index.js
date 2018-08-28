const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, redis, jwthash } = require('../../db/init');
const authenticate = require('../../mdw/authenticate');

const route = require('express').Router();

route.post('/', authenticate, function(req, res) {
  const { name, quantity, confirmPrice, username } = req.body;

  let checkQuantity = parseInt(quantity);
  let checkPrice = parseFloat(confirmPrice);
  if(Number.isInteger(checkQuantity) && checkQuantity > 0) {
    query_item(name).then((data) => {
      if(data.rows && data.rows[0]) {

        let dbitem = data.rows[0];
        let dbquantity = dbitem.quantity;
        let dbprice = dbitem.price;
        let stock_id = dbitem.stock_id;
        let finalPrice = parseFloat((checkQuantity*dbprice).toFixed(2));
        let finalQuantity = dbquantity-checkQuantity;

        if(dbquantity >= checkQuantity && finalPrice === checkPrice) {
          query_user_id(username).then((udata) => {
            if(udata.rows && udata.rows[0]) {
              userid = udata.rows[0].id;
              insert_order(dbitem.id, userid, checkPrice, checkQuantity).then(() => {
                reduce_stock(finalQuantity, stock_id).then(() => {
                  res.send({status: 200});
                }).catch((err) => {
                  console.log(err);
                  res.send({status: 400, message: "Order not processed. Please try again."});
                });
              }).catch((err) => {
                console.log(err);
                res.send({status: 400, message: "Order not processed. Please try again."});
              });
            } else {
              res.send({status: 400, message: "Account not found"});
            }
          }).catch((err) => {
            console.log(err);
            res.send({status: 500, message: "Interval Server Error"});
          });
        } else {
          res.send({status: 400, message: "Order not processed. Please try again."});
        }
      } else {
        res.send({status: 400, message: "Item doesn't exist!"});
      }
    }).catch((err) => {
      console.log(err);
      res.send({status: 500, message: "Interval Server Error"});
    });
  } else {
    res.send({status: 500, message: "Interval Server Error"});
  }
});

const insert_order = (item_id, user_id, price, quantity) => {
  return new Promise((resolve, reject) => {
    db.connect().then((client) => {
      client.query(
        'INSERT INTO orders(item_id, user_id, price, order_time, quantity) VALUES($1, $2, $3, $4, $5)', [item_id, user_id, price, new Date(), quantity]
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

const reduce_stock = (quantity, stock_id) => {
  return new Promise((resolve, reject) => {
    db.connect().then((client) => {
      client.query(
        'UPDATE stock SET quantity = $1 WHERE stock.id = $2', [quantity, stock_id]
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

const query_user_id = (username) => {
  return new Promise((resolve, reject) => {
    db.connect().then((client) => {
      client.query(
        'SELECT u.id FROM users u WHERE u.user_name = $1', [username]
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

const query_item = (name) => {
  return new Promise((resolve, reject) => {
    db.connect().then((client) => {
      client.query(
        'SELECT i.id, s.id AS stock_id, i.item_name, i.price, s.quantity FROM items i ' +
        'JOIN stock s ON i.id = s.item_id WHERE s.quantity > 0 AND i.item_name = $1', [name]
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
