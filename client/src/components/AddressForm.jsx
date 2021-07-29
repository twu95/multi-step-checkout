import React from 'react';
import * as boot from 'react-bootstrap';



class AddressForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      street: '',
      apt: '',
      zip: '',
      city: ''
    }

    this.streetRef = React.createRef();
    this.aptRef = React.createRef();
    this.zipRef = React.createRef();
    this.cityRef = React.createRef();
    this.submitAddresses = this.submitAddresses.bind(this);


  }


  componentDidMount() {
    this.setState ( {
      street: '',
      apt: '',
      zip: '',
      city: ''
    })
  }

  checkAddresses() {
    // street and zip code should be validated, and city shoudl be filled out
    let streetValue = this.streetRef.current.value;
    let zip = this.zipRef.current.value;
    let city = this.cityRef.current.value;


    let street = streetValue.split(' ');
    if (street.length !== 3) {
      alert('Please fix your street. needs street number, street name, street type');
      return false;
    }

    if (city.length < 1) {
      alert('Please fix your city.');
      return false;
    }

    if (zip.length !== 5 || (parseInt(zip).toString().length !== zip.length)) {
      alert('Please fix your ZIP code. Should be a 5 digit ZIP code');
      return false;
    }

    return true;

  }

  submitAddresses(e) {
    e.preventDefault();

    if (this.checkAddresses()) {
      this.setState({
        street: this.streetRef.current.value,
        apt: this.aptRef.current.value,
        zip: this.zipRef.current.value,
        city: this.cityRef.current.value
      }, () => {
        console.log(this.state);
        this.props.addressSubmitted();
        alert('Address is good to go. Now select your billing country to display available payment methods');
      })
    }

  }

  render() {
    return (

        <div>
          <h4> Address Information (Shipping) </h4>

        <boot.Form onSubmit={this.submitAddresses}>
          <boot.Form.Group className="mb-3" controlId="formGridAddress1">
            <boot.Form.Label> Address</boot.Form.Label>
            <boot.Form.Control  ref={this.streetRef} placeholder="1234 Main St" />
          </boot.Form.Group>

          <boot.Form.Group className="mb-3" controlId="formGridAddress2">
            <boot.Form.Label >Address 2</boot.Form.Label>
            <boot.Form.Control ref={this.aptRef} placeholder="Apartment, studio, or floor" />
          </boot.Form.Group>

          <boot.Row className="mb-3">


            <boot.Form.Group as={boot.Col} controlId="formGridCity">
              <boot.Form.Label >City</boot.Form.Label>
              <boot.Form.Control ref={this.cityRef}/>
            </boot.Form.Group>

            <boot.Form.Group as={boot.Col} controlId="formGridZip">
              <boot.Form.Label>Zip</boot.Form.Label>
              <boot.Form.Control ref={this.zipRef} placeholder="90120"/>
            </boot.Form.Group>


          </boot.Row>
          <boot.Button variant="primary" type="submit"  >
            Next
          </boot.Button>
        </boot.Form>
        </div>
    )

  }

};


export default AddressForm;



