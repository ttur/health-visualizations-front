import React from 'react';
import '../css/QueryForm.css';

export default class QueryForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.downcase = this.downcase.bind(this);
  }

  downcase(e) {
    let value = e.target.value;
    this.setState({
      value: value.toLowerCase()
    })
  }

  handleSubmit(e) {
    e.preventDefault();

    let value = this.refs.input.value;
    this.props.history.push(`/search/${value}`);
  }

  render() {
    return (
      <form className="form" onSubmit={this.handleSubmit} >
        <input id="search-input" value={this.state.value} ref="input" onChange={this.downcase} className="input" placeholder={this.props.value || "Enter any drug or symptom name (in Finnish)"} />
        <input id="search-button" type="submit" className="button" value="Search" />
      </form>
    );
  }
}