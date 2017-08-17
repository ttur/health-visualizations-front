import React from 'react';
import { render } from 'react-dom';
import Modal from 'react-modal';
import { getQuotesByKeywords, getBasketByKeyword } from '../util';
import '../css/QuoteModal.css';
import Highlighter from 'react-highlight-words';
import Spinner from 'react-spinkit'
import ReactPaginate from 'react-paginate';


export default class QuoteModal extends React.Component {

  constructor(props) {
    super(props);

    this.formatPosts = this.formatPosts.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);

    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      posts: [],
      page: 1,
      loading: false
    };
  }

  getPosts() {
    this.setState({
      posts: [],
      loading: true
    });

    const keyword1 = this.props.keyword1;
    const keyword2 = this.props.keyword2;
    const quoteModalResource = this.props.resource;
    const page = this.state.page;

    getQuotesByKeywords(quoteModalResource, keyword1, keyword2, page)
      .then((response) => {
        this.setState({
          posts: response.data.posts,
          pageCount: response.data.page_count,
          loading: false
        });
      })
      .catch((error) => {
        console.error(error);
      });

    this.setState({
      hilightWords: this.props.searchWords
    });

    if (quoteModalResource === 'relatedQuotes') {
      getBasketByKeyword(keyword2)
        .then((response) => {
          let keyword2Basket = response.data;
          this.setState({
            hilightWords: [...this.props.searchWords, ...keyword2Basket]
          });
        })
        .catch((error) => {
          console.error(error);
        })
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (!this.props.isOpen && nextProps.isOpen) {
      this.setState(this.getInitialState(), this.getPosts);
    }
  }

  componentWillMount() {    
    if (this.props.isOpen) {
      this.setState({
        page: this.props.forcePage || 1,
        posts: [],
        loading: false
      }, this.getPosts);
    }
  }

  formatPosts(posts) {
    return posts.map((post, index) => {
      return (
        <div key={index} className="modal-section">
          <Highlighter
            searchWords={this.state.hilightWords || []}
            textToHighlight={post[1]}
            className="quote-modal-text"
            autoEscape={true}
          />
        </div>
      );
    });
  }

  handlePageClick(data) {
    let page = data.selected + 1;

    this.setState({
      page
    }, () => { 
      this.getPosts();
      this.props.history.push(`/search/${this.props.keyword1}?quotes_with=${this.props.keyword2}&page=${page}`)
    });
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        contentLabel="Modal"
        className="quote-modal"
        onRequestClose={() => {
          this.props.closeModal();
        }}
      >
        <div className="quote-modal-heading">
          <button className="close-button top-right" onClick={this.props.closeModal}>&times;</button>
          <h1 className="modal-heading-header" >{this.props.heading} </h1>
        </div>
        <div className="quote-modal-content">
          { this.state.loading &&
            <Spinner fadeIn="none" name="pulse" color='black' />
          }
          { this.formatPosts(this.state.posts) }
         
          <ReactPaginate 
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={<p>...</p>}
            breakClassName={"break-me"}
            pageCount={this.state.pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageClick}
            containerClassName={this.state.loading ? "pagination-hidden" : "pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
            forcePage={this.state.page - 1}
          />          
        </div>

      </Modal>
    );
  }
}