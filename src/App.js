import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
require('./App.scss');

class BeerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      beerNames: [],
      beerImages: [],
      beerTagLines: [],
      page: 1
    }

    this.infinitePage = "https://api.punkapi.com/v2/beers?page=" + this.state.page + "&per_page=20";
  };

  componentDidMount() {
    fetch(this.infinitePage).then(resp => resp.json()).then(response => {

      this.setState({
        beerNames: response.map(item => item.name),
        beerImages: response.map(item => item.image_url),
        beerTagLines: response.map(item => item.tagline)
      })
    }).catch(err => {
      console.log('Błąd!', err);
    });
  };

  render() {
    return (<div className="container">
      <h1>house
        <span>of</span>
        beers</h1>
      <BrowserRouter>
        <div className="flexParent">
          {
            this.state.beerNames.map((beers, index) => {
              return (<Link to={`/details/${beers}`} key={index} className="beer">
                <img className="beer-image" src={this.state.beerImages[index]}/>
                <div className="beer-name">
                  {beers}</div>
                <div className="beer-tagline">{this.state.beerTagLines[index]}</div>
              </Link>)
            })
          }
        </div>
      </BrowserRouter>
    </div>);
  };
};

class App extends Component {
  render() {
    return (<BeerList/>)
  };
};

export default App;
