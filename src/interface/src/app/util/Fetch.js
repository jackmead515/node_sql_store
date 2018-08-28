import axios from 'axios';
import { store } from '../../configureStore.js';

export const order = (name, quantity, price) => {
  return new Promise((resolve, reject) => {
    axios.post('/order', {
      token: store.getState().user.token,
      username: store.getState().user.username,
      name,
      quantity,
      confirmPrice: price
    }).then((res) => {
      resolve(res.data);
    }).catch((err) => {
      console.log(err);
      reject();
    });
  });
}

export const auth = () => {
  return new Promise((resolve, reject) => {
    axios.post('/auth/auth', {
      token: store.getState().user.token,
      username: store.getState().user.username,
    }).then((res) => {
      if(res.data.status === 200) {
        resolve();
      } else {
        reject(res.data.message);
      }
    }).catch((err) => {
      console.log(err);
      reject();
    });
  });
}

export const login = (username, password) => {
  return new Promise((resolve, reject) => {
    axios.post('/auth/login', {
      username,
      password
    }).then((res) => {
      resolve(res.data);
    }).catch((err) => {
      console.log(err);
      reject(err);
    });
  });
}

export const user_orders = () => {
  return new Promise((resolve, reject) => {
    axios.post('/user', {
      token: store.getState().user.token,
      username: store.getState().user.username
    }).then((res) => {
      if(res.data.status === 200) {
        resolve(res.data.data);
      } else {
        resolve([]);
      }
    }).catch((err) => {
      console.log(err);
      reject(err);
    });
  });
}

export const items = (start) => {
  return new Promise((resolve, reject) => {
    axios.post('/store', {
      token: store.getState().user.token,
      username: store.getState().user.username,
      start
    }).then((res) => {
      if(res.data.status === 200) {
        resolve(res.data.data);
      } else {
        resolve([]);
      }
    }).catch((err) => {
      console.log(err);
      reject(err);
    });
  });
}

export const item = (name) => {
  return new Promise((resolve, reject) => {
    axios.post('/store/item', {
      token: store.getState().user.token,
      username: store.getState().user.username,
      name
    }).then((res) => {
      if(res.data.status === 200) {
        resolve(res.data.data);
      } else {
        resolve([]);
      }
    }).catch((err) => {
      console.log(err);
      reject(err);
    });
  });
}

export default {
  items,
  item,
  login,
  auth,
  order,
  user_orders
}
