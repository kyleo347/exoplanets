import React, { Component } from 'react';
import GalaxyViz from './galaxyViz.js';

export default class Galaxy extends Component {

 constructor(props) {
     super(props);
     this.state = {
         error: null,
         isLoaded: false,
         planets: [],
         searchParams:{
            pl_masse: null,
            st_mass: null,
            st_rad: null,
            pl_orbper: null,
         },
         url: new URL('https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_name,pl_radj,st_teff,st_mass,st_rad,st_dist,st_glon,st_glat,pl_masse,pl_orbsmax,pl_orbper&order=dec&format=json'),
     }
     this.retrievePlanets = this.retrievePlanets.bind(this);
     this.onChange = this.onChange.bind(this);
     this.onSubmit = this.onSubmit.bind(this);
 } 
 
 retrievePlanets() {
    fetch(this.state.url,)
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          planets: result
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error: true
        });
        console.log(error);
      }
    )
 }

 componentDidMount() {
    this.retrievePlanets();
 }

 onChange(evt) {
     let searchParams = this.state.searchParams;
     searchParams[evt.target.name] = evt.target.value;
    this.setState({ searchParams: searchParams});
}

onSubmit(evt) {
    evt.preventDefault();
    let url = this.state.url;
    let paramString = '';
    for (const param in this.state.searchParams) {
        if (this.state.searchParams.hasOwnProperty(param) && this.state.searchParams[param]) {
            paramString += param + this.state.searchParams[param] + ' and ';
        }
    }

    url.searchParams.set('where', paramString.replace(/ and $/,''));
    this.setState({ url: url });
    this.retrievePlanets();
}

 render() {
     let form = (
    <div className="App-header">
        <form onSubmit={this.onSubmit}>
            <div><h2>Exoplanets</h2></div>
            See discovered planets with 
            <label> Mass (in Earth masses):</label>
            <select name="pl_masse" onChange={this.onChange} >
                <option disabled selected="selected" value="">choose</option>
                <option value="<100">0-100</option>
                <option value="<1000">0-1000</option>
                <option value="<10000">0-10000</option>
            </select>
            that have a star with 
            <label> Mass (in Solar masses):</label>
            <select name="st_mass" onChange={this.onChange} >
                <option disabled selected="selected" value="">choose</option>
                <option value="<1">0-1</option>
                <option value="<10">0-10</option>
                <option value=">10">10+</option>
            </select>
            and 
            <label> radius (in Solar radii):</label>
            <select name="st_rad" onChange={this.onChange} >
                <option disabled selected="selected" value="">choose</option>
                <option value="<1">0-1</option>
                <option value="<10">0-10</option>
                <option value=">10">10+</option>
            </select>

            <label></label>
            <button type="submit">Submit</button>
        </form>
    </div>
    );
     if (this.state.isLoaded) {
        return(
            <div>
                {form}
                <GalaxyViz planets={this.state.planets} />
            </div> );
    } else {
        return(
            <div>
                {form}
            </div>
        );
     }
 }
}