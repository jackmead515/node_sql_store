/* @flow weak */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { SERVERIP, history } from '../../../index.js';

import Loading from '../../components/Loading';

import Navigator from "../components/Navigator";

import Fetch from '../../util/Fetch';

class Order extends Component {
  constructor(props) {
      super(props);

      this.state = {
        item: null,
        quantity: 1,
        loading: true
      }
  }

  componentWillMount() {}
  componentDidMount() {
    let url = new URL(window.location.href);

    let name = url.searchParams.get("item");
    let quantity = url.searchParams.get("quantity");

    if(!name || !quantity) {
      history.replace("/");
    }

    Fetch.item(name).then((data) => {
      if(data[0]) {
        this.setState({item: data[0], quantity, price: (data[0].price*quantity).toFixed(2) ,loading: false});
      } else {
        history.replace("/");
      }
    });
  }
  componentWillUnmount() {}

  order() {
    const { item, quantity, price } = this.state;

    this.setState({loading: true}, () => {
      Fetch.order(item.item_name, quantity, price).then((data) => {
        if(data.status === 200) {
          history.push('/profile?');
        } else {
          console.log(data.message);
        }
        this.setState({loading: false});
      }).catch((err) => {
        this.setState({loading: false});
      });
    });
  }

  renderOrder() {
    const { item, quantity } = this.state;

    return (
      <div className="item__container" style={{zIndex: 2}}>
        <img className="item__image" src={SERVERIP + "/images/" + item.image_url}/>
        <div className="item__info">
          <h2 className="item__name">{item.item_name}</h2>
          <h3 className="item__description">{item.long_descript}</h3>
          <div className="row--between" style={{width: '100%'}}>
            <div className="row--center">
              <b>{quantity} * ${item.price} =</b>
              <span className="item__price">&nbsp;${(item.price*quantity).toFixed(2)}</span>
            </div>
            <button
              className="item__order"
              style={{marginTop: 0}}
              onClick={() => this.order()}
            >
              Purchase!
            </button>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { loading } = this.state;
    return (
      <div className="home__container">
        <Navigator />
        <h1>Node Store</h1>
        {loading ? <Loading /> : this.renderOrder()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state };
}

export default connect(mapStateToProps)(Order);
