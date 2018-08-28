import React, { Component } from 'react';

import { SERVERIP } from '../../index.js';

export default class Loading extends Component {
  render() {
    return (
      <div className="loading__container">
        <img src={SERVERIP + "/images/loading.gif"} className="loading__gif"/>
      </div>
    );
  }
}
