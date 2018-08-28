import React, { Component } from 'react';
import { connect } from 'react-redux';

class Admin extends Component {
  render() {
    return (
      <div className="admin__container">
        <h1>Admin</h1>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state };
}

export default connect(mapStateToProps)(Admin);
