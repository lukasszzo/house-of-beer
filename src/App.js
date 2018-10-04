import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import { ModalContainer, ModalRoute } from 'react-router-modal';

require('./App.scss');

    const BeerDetails = ({match}) => (
        <div>
            <p>
                {match.params.beerId}
            </p>
        </div>
    )

    class BeerList extends Component {
        constructor(props) {
            super(props);

            this.state = {
                beerNames : [],
                beerImages : [],
                beerTagLines : [],
                page : 1
            };
            this.handleScroll = this.handleScroll.bind(this);
            this.infinitePage = "https://api.punkapi.com/v2/beers?page="+this.state.page+"&per_page=20";
        };


        handleScroll(e) {
            e.preventDefault();
            let documentHeight = document.documentElement.offsetHeight;
            let scrollTotal = window.scrollY + window.innerHeight;

            if (scrollTotal == documentHeight) {

                this.setState({ page:
                    this.state.page + 1
                });

                this.infinitePage = "https://api.punkapi.com/v2/beers?page=" + this.state.page + "&per_page=20";

                fetch(this.infinitePage)
                .then(resp => resp.json())
                .then(response => {

                    response.forEach(element => {
                        this.state.beerNames.push(element.name);
                        this.state.beerImages.push(element.image_url);
                        this.state.beerTagLines.push(element.tagline);
                    })
                })
                .catch( err => {
                    console.log('Error!', err);
                });
            };

        };

        componentDidMount() {
            window.addEventListener("scroll", this.handleScroll);

            fetch(this.infinitePage)
                .then(resp => resp.json())
                .then(response => {

                    if (response[2].id > 234) {
                        alert('Sorry, end of the list :(');
                    }

                    this.setState({
                        beerNames: response.map( item => item.name),
                        beerImages: response.map( item => item.image_url),
                        beerTagLines: response.map( item => item.tagline)
                    })
                })
                .catch( err => {
                    console.log('Error', err);
                });
        };

        componentWillUnmount() {
            window.removeEventListener("scroll", this.handleScroll);
        };

        render() {

            const { match } = this.props;

            if (this.state.beerNames.length == 0) {
                return (
                    <div className="container">
                        <h1>House <span>of</span>beers</h1>
                        <p>Loading... </p>
                    </div>
                )
            } else {

                return (
                    <div className="container">
                            <h1>House <span>of</span>beers</h1>
                            <BrowserRouter>
                            <main>
                                <Switch>
                                    <div className="flexParent">
                                        {this.state.beerNames.map((beers,index) =>{
                                            return (
                                                <Link to={`/details/${beers}`} key={index} className="beer">
                                                    <img className="beer-image" src={this.state.beerImages[index]} />
                                                    <div className="beer-name"> {beers}</div>
                                                    <div className="beer-tagline">{this.state.beerTagLines[index]}</div>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </Switch>
                                <ModalRoute component={BeerDetails} path={`/details/:beerId`} parentPath='/'></ModalRoute>
                                <ModalContainer />
                            </main>
                        </BrowserRouter>
                    </div>
                );
            }
        };
};

    export default class App extends Component {
        render() {
            return (<BeerList/>)
        };
    };
