import React, { Component } from 'react';
import { connect } from 'react-redux';

import { history } from '../../../index.js';

import Loading from '../../components/Loading';
import SmallItem from '../../components/SmallItem';

import Navigator from "../components/Navigator";

import Fetch from '../../util/Fetch';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: {},
      scrollLoading: true,
      page: 0
    }
    this.pageAmount = 10;
    this.scrollEnabled = true;
  }

  componentDidMount() {
    Fetch.items(0).then((data) => {
      let i = this.state.items;
      i[0] = data;
      this.setState({items: i, scrollLoading: false});
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
            onClick={() => history.push('/item/' + i.item_name)}
          />
        );
      });
    });
  }

  render() {
    return (
      <div className="home__container">
        <Navigator />
        <h1>Node Store</h1>
        <div className="home__itemcontainer">
          {this.renderItems()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state };
}

export default connect(mapStateToProps)(Home);
