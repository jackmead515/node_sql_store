/* @flow weak */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import moment from 'moment';

import Navigator from "../components/Navigator";

import Fetch from '../../util/Fetch';

import Loading from '../../components/Loading';

class Profile extends Component {
  constructor(props) {
      super(props);

      this.state = {
        orders: [],
        loading: true
      }
  }

  componentWillMount() {}
  componentDidMount() {

    Fetch.user_orders().then((data) => {
      this.setState({orders: data, loading: false});
    });
  }
  componentWillUnmount() {}

  renderUserInfo() {
    const { user } = this.props;

    return (
      <div className="profile__user">
        {user.firstname} {user.lastname} - {user.username}
      </div>
    )
  }

  renderOrders() {
    const { orders } = this.state;

    return (
      <table className="profile__table">
        <tr className="profile__row">
          <th className="profile__heading">Order Date</th>
          <th className="profile__heading">Item Name</th>
          <th className="profile__heading">Quantity</th>
          <th className="profile__heading">Price</th>
        </tr>
        {orders.map((o, i) => {
          return (
            <tr className="profile__row" key={i}>
              <td className="profile__elem">{moment(o.order_time).format('MMM, D YYYY - h:mma')}</td>
              <td className="profile__elem">{o.item_name}</td>
              <td className="profile__elem">{o.quantity}</td>
              <td className="profile__elem">${o.price}</td>
            </tr>
          )
        })}
      </table>
    )
  }

  render() {
    const { loading } = this.state;
    return (
      <div className="profile__container">
        <Navigator />
        {this.renderUserInfo()}
        {loading ? <Loading /> : this.renderOrders()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state };
}

export default connect(mapStateToProps)(Profile);
