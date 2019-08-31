import React, { Component } from "react";
import "./Form.css";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: "usd",
      metal: "gold",
      metalPrice: 1290.34,
      purity: 24,
      weight: 0,
      weightType: "grams",
      price: 0,
      askingPrice: 2000,
      markup: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.calcPrice = this.calcPrice.bind(this);
    this.calcMarkup = this.calcMarkup.bind(this);
    this.metalCheck = this.metalCheck.bind(this);
    this.priceCheck = this.priceCheck.bind(this);
    this.gramsInOz = 28.3495;
  }

  calcMarkup(market, asking) {
    if (this.state.weightType === "oz") {
      let inter = asking / market;
      let markup = ((inter - 1) * 100).toFixed(2);
      this.setState({ markup });
    } else if (this.state.weightType === "grams") {
      let newAsking = asking / this.gramsInOz;
      let inter = newAsking / market;
      let markup = ((inter - 1) * 100).toFixed(2);
      this.setState({ markup });
    }
  }

  calcPrice(weight, price) {
    return (weight * price).toFixed(2);
  }

  handleChange(event) {
    let id = event.target.id;
    let value = event.target.value;
    if (id === "currency") {
      this.setState({ currency: value });
      // async await callback to get currecy values
    } else if (id === "metal") {
      this.setState({ metal: value }, this.metalCheck(value));
      // async await callback to get price of other metal
    } else if (id === "weightType") {
      this.setState({ weightType: value }, () => {
        this.priceCheck(value);
        this.calcMarkup(this.state.price, this.state.askingPrice);
      });
    } else if (id === "weight") {
      this.setState({ weight: value }, () => {
        this.priceCheck(this.state.weightType, value);
        this.calcMarkup(this.state.price, this.state.askingPrice);
      });
    } else if (id === "askingPrice") {
      this.setState(
        { askingPrice: value },
        this.calcMarkup(this.state.price, this.state.askingPrice)
      );
    }
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  priceCheck(type, weight = this.state.weight) {
    let price;
    if (type === "grams") {
      price = this.calcPrice(weight, this.state.metalPrice / this.gramsInOz);
    } else if (type === "oz") {
      price = this.calcPrice(weight, this.state.metalPrice);
    }
    this.setState({ price });
  }

  metalCheck(metal) {
    if (metal === "gold") {
      this.setState({ metalPrice: 1290.34 });
    } else if (metal === "silver") {
      this.setState({ metalPrice: 541 });
    } else if (metal === "platinum") {
      this.setState({ metalPrice: 1460 });
    }
  }

  render() {
    return (
      <form className="Form" onSubmit={this.handleSubmit}>
        <select
          className="mainSelect"
          id="currency"
          value={this.state.currency}
          onChange={this.handleChange}
        >
          <option value="usd" label="USD" />
          <option value="gbp" label="GBP" />
          <option value="eur" label="EUR" />
        </select>{" "}
        <select
          className="mainSelect"
          id="metal"
          value={this.state.metal}
          onChange={this.handleChange}
        >
          <option value="gold" label="Gold" />
          <option value="silver" label="Silver" />
          <option value="platinum" label="Platinum" />
        </select>
        <p>
          <span>Price per Oz: </span>
          <span>$ {this.state.metalPrice}</span>
        </p>
        <p>
          <span>Price per Gram (24k): </span>
          <span>$ {(this.state.metalPrice / this.gramsInOz).toFixed(2)}</span>
        </p>
        <p>
          <span>Jewelry Weight</span>
          <span>
            <input
              id="weight"
              type="text"
              value={this.state.weight}
              onChange={this.handleChange}
              style={{ width: "70px" }}
            />
            <select
              id="weightType"
              value={this.state.weightType}
              onChange={this.handleChange}
            >
              <option value="grams" label="grams" />
              <option value="oz" label="oz" />
            </select>
          </span>
        </p>
        <p>
          <span>Asking Price:</span>
          <input
            id="askingPrice"
            type="text"
            value={this.state.askingPrice}
            onChange={this.handleChange}
            style={{ width: "70px" }}
          />
        </p>
        <p>
          <span>Commodity Price:</span>
          <span>{this.state.price}</span>
        </p>
        <p>
          <span>Percentage Markup:</span>
          <span>{this.state.markup} %</span>
        </p>
      </form>
    );
  }
}

export default Form;
