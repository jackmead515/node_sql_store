const { Pool } = require('pg');
const redis = require("redis");

const client = redis.createClient({
  host: '127.0.0.1',
  port: 6379
});

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'node_sql_store',
  password: 'password1!',
  port: 5432,
});

const users = () => {
  return new Promise((resolve, reject) => {
    pool.connect().then((client) => {
      client.query(
        'CREATE TABLE IF NOT EXISTS users (' +
        'id SERIAL PRIMARY KEY,' +
        'user_name VARCHAR(100) NOT NULL UNIQUE,' +
        'password VARCHAR(100) NOT NULL,' +
        'first_name VARCHAR(200) NOT NULL,' +
        'last_name VARCHAR(200) NOT NULL)'
      ).then(() => {
        client.release();
        resolve();
      }).catch((e) => {
        client.release();
        console.log(e);
        reject(e);
      });
    }).catch((e) => {
      console.log(e)
      reject(e)
    });
  });
}

const items = () => {
  return new Promise((resolve, reject) => {
    pool.connect().then((client) => {
      client.query(
        'CREATE TABLE IF NOT EXISTS items (' +
        'id SERIAL PRIMARY KEY,' +
        'item_name VARCHAR(100) NOT NULL,' +
        'short_descript VARCHAR(1000) NOT NULL,' +
        'long_descript VARCHAR(5000) NOT NULL,' +
        'image_url VARCHAR(100),' +
        'price NUMERIC(10,2) NOT NULL)'
      ).then(() => {
        client.release();
        resolve();
      }).catch((e) => {
        client.release();
        console.log(e);
        reject(e);
      });
    }).catch((e) => {
      console.log(e)
      reject(e)
    });
  });
}

const stock = () => {
  return new Promise((resolve, reject) => {
    pool.connect().then((client) => {
      client.query(
        'CREATE TABLE IF NOT EXISTS stock (' +
        'id SERIAL PRIMARY KEY,' +
        'item_id SERIAL REFERENCES items(id),' +
        'quantity INTEGER NOT NULL)'
      ).then(() => {
        client.release();
        resolve();
      }).catch((e) => {
        client.release();
        console.log(e);
        reject(e);
      });
    }).catch((e) => {
      console.log(e)
      reject(e)
    });
  });
}

const orders = () => {
  return new Promise((resolve, reject) => {
    pool.connect().then((client) => {
      client.query(
        'CREATE TABLE IF NOT EXISTS orders (' +
        'id SERIAL PRIMARY KEY,' +
        'item_id SERIAL REFERENCES items(id),' +
        'user_id SERIAL REFERENCES users(id),' +
        'price NUMERIC(10,2) NOT NULL,' +
        'order_time TIMESTAMP NOT NULL,' +
        'quantity INTEGER NOT NULL)'
      ).then(() => {
        client.release();
        resolve();
      }).catch((e) => {
        client.release();
        console.log(e);
        reject(e);
      });
    }).catch((e) => {
      console.log(e)
      reject(e)
    });
  });
}

users().then(items().then(stock().then(orders())));

module.exports = {
  db: pool,
  redis: client,
  jwthash: 'secretsalt'
};
