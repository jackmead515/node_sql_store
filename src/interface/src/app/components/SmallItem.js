import React, { Component } from 'react';

import { SERVERIP } from '../../index.js';

export default class SmallItem extends Component {
  constructor(props) {
      super(props);

      this.state = {
        display: 'none'
      }
  }

  componentWillMount() {
      const { animate } = this.props;

      setTimeout(() => {
        this.setState({display: "flex"});
      }, animate);
  }

  render() {
    const { display } = this.state;
    const { image, description, title, price, onClick } = this.props;

    return (
      <div
        className="animatedFast fadeInRight smallitem__container"
        style={{display}}
        onClick={() => onClick()}
      >
        <img className="smallitem__image" src={SERVERIP + "/images/" + image} />
        <div className="smallitem__details">
          <p className="smallitem__title">{title}</p>
          <p className="smallitem__description">{description}</p>
          <p className="smallitem__price">${price}</p>
        </div>
      </div>
    );
  }
}
