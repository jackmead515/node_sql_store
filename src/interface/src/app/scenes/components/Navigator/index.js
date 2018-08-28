import React, { Component } from 'react';
import { connect } from 'react-redux';

import { history } from '../../../../index.js';

var FAIcon = require('react-fontawesome');

class Navigator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchVal: ""
    }

  }

  renderLogin() {
    const { user } = this.props;

    if(user.username && user.firstname && user.lastname && user.token) {
      return (
        <div
          className="nav__button"
          title="Profile"
          onClick={() => history.push('/profile')}
        >
          Welcome, {user.username}!
        </div>
      )
    } else {
      return (
        <div
          className="nav__button"
          onClick={() => history.push('/login')}
        >
          Login
        </div>
      )
    }
  }

  onSearch(e) {
    if(e.which === 13) {

    } else {
      this.setState({searchVal: e.target.value});
    }
  }

  render() {
    return (
      <div className="nav__container">
        <div
          className="nav__button"
          onClick={() => history.push('/')}
        >
          Home
        </div>
        <input
          type="text"
          className="nav__search"
          placeholder="Search for any product!"
          value={this.state.searchVal}
          onChange={(e) => this.onSearch(e)}
        />
        {this.renderLogin()}
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return { ...state };
}

export default connect(mapStateToProps)(Navigator);
