import React, { Component } from 'react';
import {
  Switch,
  Route
} from 'react-router-dom'

import Landing from './components/Landing';
import Search from './components/Search';
import NotFound from './components/NotFound';
import FAQ from './components/FAQ';

export default class Main extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={ Landing } />
        <Route path="/search/:keyword" component={ Search } />
        <Route path='/not_found/:keyword' component={ NotFound } />
        <Route exact path="/faq" component={ FAQ } />
      </Switch>
    );
  }
}