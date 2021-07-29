import AdyenCheckout from '@adyen/adyen-web';
import '@adyen/adyen-web/dist/adyen.css';

import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import CountryList from './components/CountryList.jsx';
import AddressForm from './components/AddressForm.jsx';
import AccountForm from './components/AccountForm.jsx';

import * as boot from 'react-bootstrap';

// import {CLIENT_KEY} from '../../config';
const CLIENT_KEY = 'test_SZWLFDGHY5AO3P7KCZ5JMXGYXQBGLDUE';

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
      paymentMethods: {},
      nameInfo: false,
      addressInfo: false

    };
    this.handleClick = this.handleClick.bind(this);
    this.createNewCheckout = this.createNewCheckout.bind(this);
    this.checkoutRef = React.createRef();
    this.makePayment = this.makePayment.bind(this);
    this.nameSubmitted = this.nameSubmitted.bind(this);
    this.addressSubmitted = this.addressSubmitted.bind(this);

  }

  nameSubmitted () {
    this.setState({
      nameInfo: true
    })
  }

  addressSubmitted() {
    this.setState({
      addressInfo: true
    })
  }


  componentDidMount() {
    this.setState({
      currentCountry: 'United States',
      countries: ['United States', 'Netherlands', 'China', 'Japan', 'Korea'],
      paymentMethods: {},
      nameInfo: false,
      addressInfo: false
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

    return (
    <div>
      <h1>Multi-Step Checkout</h1>

        <AccountForm nameSubmitted={this.nameSubmitted} />


        {this.state.nameInfo && <AddressForm addressSubmitted={this.addressSubmitted}/ > }


        {this.state.addressInfo &&
          <div>
            <h4> Billing Country: </h4>
            <boot.ListGroup>
              {this.state.countries.map((country) =>
                <CountryList country={country} handleClick={this.handleClick.bind(this)} />
              )}
            </boot.ListGroup>
            <h4>Payment through Adyen Payments Processing API</h4>
              Ready to Pay? Test Card Info Below:
              <div>
              4646 4646 4646 4644
              <div> EXP: 03/30, CVC: 737 </div>

              </div>
            <span className="justify-content-between align-items-center">
              <button onClick={(e) => this.getPaymentMethod(e)}> Click Here </button>
            </span>
          </div>
        }

        <div ref={this.checkoutRef}></div>




    </div>);
  }

}

ReactDOM.render(<App />, document.getElementById('app'));

export default App;
