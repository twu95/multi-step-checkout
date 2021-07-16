import AdyenCheckout from '@adyen/adyen-web';
import '@adyen/adyen-web/dist/adyen.css';

import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import CountryList from './components/CountryList.jsx';

import * as boot from 'react-bootstrap';

import {CLIENT_KEY} from '../../config';

const countryCodes = {
  'United States': 'US',
  'Netherlands': 'NL',
  'Japan': 'JP',
  'Korea': 'KR',
  'China': 'CN'
};




class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: [],
      currentCountry: '',
      paymentMethods: {}

    };
    this.handleClick = this.handleClick.bind(this);
    this.createNewCheckout = this.createNewCheckout.bind(this);
    this.checkoutRef = React.createRef();
    this.makePayment = this.makePayment.bind(this);

  }


  componentDidMount() {
    this.setState({
      currentCountry: 'United States',
      countries: ['United States', 'Netherlands', 'China', 'Japan', 'Korea'],
      paymentMethods: {}
    });
  }


  handleClick (e) {
    this.setState({
      currentCountry: e.target.value
    },
    () => {
      console.log(this.state);
    });
  }


  getPaymentMethod(e) {
    e.preventDefault();

    let data = {
      countryCode: countryCodes[this.state.currentCountry],
    };

    axios.post('/paymentMethods', data)
      .then((response) => {
        this.setState({
          paymentMethods: response.data
        },
        () => {
          let checkout = this.createNewCheckout();
          let dropin = checkout.create(
            'dropin', {
              openFirstPaymentMethod: true
            }
          ).mount(this.checkoutRef.current);
        });
      })
      .catch((err) => console.error(err));

  }

  makePayment(stateData) {


    axios.post('/payments', stateData)
      .then((response) => {

        if (response.data.resultCode === "Authorised") {
          alert('Payment Successful :)');
        } else {
          alert(`Payment unsuccessful because of ${response.data.refusalReason}`);
        }
      })
      .catch(err => console.log(err));

  }

  createNewCheckout () {
    return new AdyenCheckout({
      paymentMethodsResponse: this.state.paymentMethods,
      clientKey: CLIENT_KEY,
      environment: "test",
      locale: "en-US",
      onSubmit: (state, dropin) => {

        this.makePayment(state.data)
          .then(response => {
            if (response.action) {
              // Drop-in handles the action object from the /payments response
              dropin.handleAction(response.action);
            } else {
              // Your function to show the final result to the shopper
              // showFinalResult(response);
              console.log(response);
            }
          })
          .catch(error => {
            throw Error(error);
          });
      },

      onAdditionalDetails: (state, dropin) => {
        // Your function calling your server to make a `/payments/details` request
        makeDetailsCall(state.data)
          .then(response => {
            if (response.action) {
              // Drop-in handles the action object from the /payments response
              dropin.handleAction(response.action);
            } else {
              // Your function to show the final result to the shopper
              showFinalResult(response);
            }
          })
          .catch(error => {
            throw Error(error);
          });
      }

    });

  }

  render () {
    return (<div>
      <h1>Adyen Code Challenge - Drop-In</h1>

      <h2> Select a Country: </h2>

      <boot.ListGroup>
        {this.state.countries.map((country) =>
          <CountryList country={country} handleClick={this.handleClick.bind(this)} />
        )}
      </boot.ListGroup>

      <h4>Payment</h4>
      Ready to Pay?
      <span className="justify-content-between align-items-center">
        <button onClick={(e) => this.getPaymentMethod(e)}> Click Here </button>
      </span>

      <div ref={this.checkoutRef}></div>
    </div>);
  }

}

ReactDOM.render(<App />, document.getElementById('app'));

export default App;
