import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import AppContainer from '../containers/AppContainer';
import Companies from './companies';
import { getLocalStorage, clearLocalStorage, localStorageEmpty } from './helperFunctions';

export class App extends Component {
  constructor() {
    super();
    this.state = {
      searchText: '',
      user: '',
    };
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.handleSubmittedSearch = this.handleSubmittedSearch.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (this.state.user) {
      return;
    } else if (localStorage.length > 0) {
      this.setState({ user: localStorage });
      console.log('mount it');
      const { email, password } = getLocalStorage();
      fetch('http://localhost:3000/companies', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': email + ':' + password,
        },
        method: 'GET',
      }).then(response => response.json())
      .then(payload => this.props.addCompanies(payload.companies));
    }
  }

  componentDidMount() {
    if (localStorage.length > 0) {
      const { email, password } = getLocalStorage();
      fetch('http://localhost:3000/companies', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': email + ':' + password,
        },
        method: 'GET',
      }).then(response => response.json())
      .then(payload => this.props.addCompanies(payload.companies));
    }
  }

  handleUpdateInput(searchText) {
    this.setState({ searchText: searchText });
  }

  handleSubmittedSearch() {
    try {
      let CompanyObj = this.props.companies.filter(company => company.name.toLowerCase() === this.state.searchText.toLowerCase());
      if (CompanyObj) {
        browserHistory.push(`/${CompanyObj[0].name}`);
        this.setState({ searchText: '' });
      }
    } catch (e) {
      console.log('Not a supported company.  Try again.');
    }
  }

  toggleCompaniesBtnPath() {
    return (
      <Link to='/'>
        <RaisedButton
          className='btn'
          type='submit'
          label='Companies'
        />
      </Link>
    );
  }

  toggleLogoutBtn() {
    return (
      <RaisedButton
        className='btn logout-btn'
        type='submit'
        label='Logout'
        onClick={() => clearLocalStorage()}
      />
    );
  }

  toggleSearchField(allCompanies) {
    return (
      <AutoComplete
        hintText='Search for a company'
        searchText={this.state.searchText}
        onUpdateInput={this.handleUpdateInput}
        onNewRequest={this.handleSubmittedSearch}
        dataSource={allCompanies}
        filter={(searchText, key) => (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)}
        openOnFocus
      />
    );
  }

  toggleLoginBtn() {
    return (
      <RaisedButton
        className='btn login-btn'
        type='submit'
        label='Login'
        onClick={() => browserHistory.push('/login')}
      />
    );
  }

  render() {
    const allCompanies = this.props.companies.map(obj => obj.name);
    return (
      <MuiThemeProvider >
        <div className='app-header'>
          <h1>Neumann</h1>
          {localStorage.length > 0 && window.location.pathname !== '/' ? this.toggleCompaniesBtnPath() : null}
          {localStorage.length > 0 ? this.toggleSearchField(allCompanies) : null}
          {localStorage.length > 0 ? this.toggleLogoutBtn() : null}
          {localStorage.length === 0 && window.location.pathname === '/' ? this.toggleLoginBtn() : null}
          {window.location.pathname === '/' ? <p className='tagline'>Neumann - the first employer Alan Turing said 'Fuck You' to</p> : null}
          {window.location.pathname === '/' ? <p className='directional-text'>begin by browsing or searching for companies</p> : null}
          {window.location.pathname === '/' ? <Companies /> : null}
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  companies: React.PropTypes.array,
  children: React.PropTypes.object,
  addCompanies: React.PropTypes.func,
  setActiveUser: React.PropTypes.func,
  deleteComment: React.PropTypes.func,
};

export default AppContainer(App);
