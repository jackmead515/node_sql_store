import React, { Component } from 'react';
import { connect } from 'react-redux';

import { SERVERIP, history } from '../../../index.js';

import Loading from '../../components/Loading';
import SmallItem from '../../components/SmallItem';
import Navigator from "../components/Navigator";

import Fetch from '../../util/Fetch';

class Item extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: null,
      items: {},
      loading: true,
      scrollLoading: false,
      page: 0,
      renderOrderForm: false,
      quantity: 1,
      orderFormClasses: "animatedFast fadeInDown"
    }

    this.pageAmount = 10;
    this.scrollEnabled = true;
  }

  componentDidMount() {
    const { match } = this.props;

    Fetch.item(match.params.name).then((data) => {
      if(data[0]) {
        this.setState({item: data[0], loading: false});
      } else {
        this.setState({loading: false});
      }
    });

    Fetch.items(0).then((data) => {
      let i = this.state.items;
      i[0] = data;
      this.setState({items: i});
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", () => this.updateDimensions());
    window.removeEventListener("scroll", () => this.updateScrollPosition());
  }

  componentWillMount() {
    window.addEventListener("resize", () => this.updateDimensions());
    window.addEventListener("scroll", () => this.updateScrollPosition());
  }

  updateScrollPosition() {
    var scrollTop = (window.pageYOffset || window.scrollTop)  - (window.clientTop || 0);
    var scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;

    if(scrollTop + window.innerHeight >= scrollHeight && this.scrollEnabled) {
      this.scrollRefreshData();
    } else if(scrollHeight === window.innerHeight && this.scrollEnabled) {
      this.scrollRefreshData();
    }
  }

  updateDimensions() {
    var width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

    var height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

    this.setState({windowHeight: height, windowWidth: width});


    //width < 760px -> mobile
  }

  scrollRefreshData() {
    const { page, scrollLoading } = this.state;

    if(scrollLoading) { return; }

    this.setState({page: page+this.pageAmount, scrollLoading: true}, () => {
      Fetch.items(this.state.page).then((data) => {
        if(data.length <= 0) {
          this.setState({scrollLoading: false});
          this.scrollEnabled = false;
        } else {
          let i = this.state.items;
          i[this.state.page] = data;
          this.setState({items: i, scrollLoading: false});
        }
      });
    });
  }

  order() {
    const { item, quantity } = this.state;
    history.push("/login?dir=order&item=" + item.item_name + "&quantity=" + quantity);
  }

  renderItem() {
    const { item } = this.state;

    if(!item) {
      return (
        <div className="item__container">
          <p>Item not found</p>
        </div>
      );
    }

    return (
      <div className="item__container" style={{zIndex: 2}}>
        <img className="item__image" src={SERVERIP + "/images/" + item.image_url}/>
        <div className="item__info">
          <h2 className="item__name">{item.item_name}</h2>
          <h3 className="item__description">{item.long_descript}</h3>
          <div className="row--between" style={{width: '100%'}}>
            <span className="item__price">${item.price}</span>
            <span className="item__quantity"><b>{item.quantity}</b> In Stock</span>
          </div>
          <button
            className="item__order"
            onClick={() => this.setState({renderOrderForm: !this.state.renderOrderForm})}
          >
            Order
          </button>
        </div>
      </div>
    )
  }

  renderOrderForm() {
    const { item, orderFormClasses } = this.state;

    return (
      <div className={"item__form " + orderFormClasses}  style={{zIndex: 1}}>
        <input
          className="item__quantity--form"
          style={{marginRight: 10}}
          type="number"
          value={this.state.quantity}
          onChange={(e) => {
            let val = e.target.value;
            if(val > item.quantity) {
              this.setState({quantity: item.quantity})
            } else if(val < 1) {
              this.setState({quantity: 1})
            } else {
              this.setState({quantity: val})
            }
          }}
        />
        <span
          className="item__price--form"
          style={{marginRight: 10}}
        >
          ${(this.state.quantity*item.price).toFixed(2)}
        </span>
        <button
          className="item__order--form"
          onClick={() => this.order()}
        >
          Place Order
        </button>
      </div>
    );
  }

  renderItems() {
    const { items } = this.state;

    let keys = Object.keys(items)

    return keys.map((key, id) => {
      return items[key].map((i, an) => {
        return (
          <SmallItem
            key={i.item_name}
            animate={an*100}
            title={i.item_name}
            description={i.short_descript}
            image={i.image_url}
            price={i.price}
            onClick={() => {
              history.replace('/item/' + i.item_name)
              window.location.reload();
            }}
          />
        );
      });
    });
  }

  render() {
    const { loading, renderOrderForm } = this.state;
    return (
      <div className="home__container">
        <Navigator />
        <h1>Node Store</h1>
        {loading ? <Loading /> : this.renderItem()}
        {loading || !renderOrderForm ? null : this.renderOrderForm()}
        <div className="home__itemcontainer" style={{marginTop: 20}}>
          {this.renderItems()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state };
}

export default connect(mapStateToProps)(Item);
