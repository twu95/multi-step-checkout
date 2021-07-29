import React from 'react';
import * as boot from 'react-bootstrap';



class AccountForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      email: ''
    }

    this.nameRef = React.createRef();
    this.emailRef = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);

  }


  componentDidMount() {
    this.setState({
      name: '',
      email: ''
    })

  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.nameRef.current.value.length < 2 || this.emailRef.current.value.length < 1) {
      alert('Please fill out a name and email');
    } else if (this.emailRef.current.value.split('@').length !== 2) {
      alert('Please fill out a valid email');
    } else {
      this.setState({
        name: this.nameRef.current.value,
        email: this.emailRef.current.value
      }, () => {
        console.log(this.state);
        this.props.nameSubmitted();
        alert('Thanks for entering your info, please fill out your address');
      })
    }

  }

  render() {
    return (
      <div>
      <h4> Buyer Information </h4>

      <boot.Form onSubmit={(e) => this.handleSubmit(e)}>

        <boot.Form.Group className="mb-3" controlId="formGridEmail">
          <boot.Form.Label>Email Address</boot.Form.Label>
          <boot.Form.Control ref={this.emailRef} placeholder="abcd@gmail.com" />
        </boot.Form.Group>

        <boot.Form.Group className="mb-3" controlId="formGridName">
          <boot.Form.Label>Name</boot.Form.Label>
          <boot.Form.Control ref={this.nameRef} placeholder="Jane Doe" />
        </boot.Form.Group>


        <boot.Button variant="primary" type="submit">
          Next
        </boot.Button>
      </boot.Form>
      </div>
    )
  }

};


export default AccountForm;



