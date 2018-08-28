/* @flow weak */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Loading from '../../components/Loading';

import Navigator from "../components/Navigator";

import Fetch from '../../util/Fetch';
import { login } from '../../actions/user';
import { history } from '../../../index.js';

class Login extends Component {
  constructor(props) {
      super(props);

      this.state = {
        username: props.user.username ? props.user.username : '',
        password: '',
        loading: true
      }
  }

  componentWillMount() {}

  componentDidMount() {

    let newURL = this.getNewURL();

    Fetch.auth().then(() => {
      history.replace(newURL);
    }).catch((err) => {
      this.setState({loading: false});
    });
  }

  componentWillUnmount() {}

  getNewURL() {
    let url = new URL(window.location.href);
    let dir = url.searchParams.get("dir");

    let newURL = '/';
    if(dir === 'order') {
      let item = url.searchParams.get("item");
      let quantity = url.searchParams.get("quantity");
      newURL = '/order?item=' + item + '&quantity=' + quantity;
    }

    return newURL
  }

  login() {
    const { username, password } = this.state;

    this.setState({loading: true});
    Fetch.login(username, password).then((data) => {
      if(data.status === 200) {
        this.props.dispatch(login({firstname: data.firstname, lastname: data.lastname, username: data.username, token: data.token}));
        history.replace(this.getNewURL());
      } else {
        console.log(data.message);
        this.setState({loading: false});
      }
    }).catch((err) => {
      console.log(err);
      this.setState({loading: false});
    });
  }

  renderLogin() {
    const { username, password } = this.state;
    return (
      <div className="login__form">
        <input
          className="login__username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => this.setState({username: e.target.value})}
        />
        <input
          className="login__password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => this.setState({password: e.target.value})}
        />
        <button
          className="login__submit"
          onClick={() => this.login()}
        >
          Login
        </button>
      </div>
    )
  }

  render() {
    const { loading } = this.state;
    return (
      <div className="login__container">
        {loading ? <Loading /> : this.renderLogin()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state };
}

export default connect(mapStateToProps)(Login);
