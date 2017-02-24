import React, { Component } from 'react';
import { Link } from 'react-router';
import Login from './login';

export default class App extends Component {

  componentDidMount() {
    const getStorage = JSON.parse(localStorage.getItem('activeUserId'));
    const { email, password } = getStorage;
    fetch('http://localhost:3000/companies', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': email + ":" + password,
      },
      method: 'GET',
    }).then(response => response.json())
    .then(payload => this.props.addCompanies(payload.companies));
  }

  toggleCityBtnPath() {
    return (
      <Link to='/cities'>
        <input
          className='btn'
          type='submit'
          value='Cities'
        />
      </Link>
    )
  }

  toggleCompaniesBtnPath() {
    return (
      <Link to='/companies'>
        <input
          className='btn'
          type='submit'
          value='Companies'
        />
      </Link>
    )
  }

  render () {
    return (
      <div>
        <h1>Neumann's Assistant</h1>
        {this.toggleCityBtnPath()}
        {this.toggleCompaniesBtnPath()}
        {this.props.children}
      </div>
    )
  }
}
