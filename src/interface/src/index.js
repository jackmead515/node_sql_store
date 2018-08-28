import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import reducers from './app/reducers';
import axios from 'axios';
import { Route, Router, Redirect, Switch } from 'react-router';
import { persistor, store } from './configureStore';
import { PersistGate } from 'redux-persist/lib/integration/react';
import createBrowserHistory from 'history/createBrowserHistory';

import './app/styles/index.css';

import Admin from './app/scenes/Admin';
import Home from './app/scenes/Home';
import Item from './app/scenes/Item';
import Login from './app/scenes/Login';
import Order from './app/scenes/Order';
import Profile from './app/scenes/Profile';

export const SERVERIP = process.env.NODE_ENV === 'development' ? 'https://www.nodestore.com' : 'https://www.nodestore.com';

export const history = createBrowserHistory();

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'https://www.nodestore.com/api' : 'https://www.nodestore.com/api';

ReactDOM.render((
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <Router history={history} onUpdate={() => window.scrollTo(0,0)}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/order" component={Order} />
          <Route exact path="/admin" component={Admin} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/item/:name" component={Item} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </Router>
    </Provider>
  </PersistGate>
), document.getElementById('root'));

registerServiceWorker();
