import React, {Component } from "react";
import * as d3 from "d3";

export default class GalaxyViz extends Component {
    constructor() {
        super()
        this.state = {
            width : Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
            height : Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
            svg : null,
        }
        
        this.draw = this.draw.bind(this);
        this.zoomed = this.zoomed.bind(this);
        this.zoom = d3.zoom()
        .scaleExtent([1,10])
        .on("zoom", this.zoomed);
        
    }


    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        this.draw(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.planets.length !== nextProps.planets.length) {
            d3.selectAll('circle')
            .data(nextProps.planets)
            .exit()            
            .transition()
            .duration(2000)
            .attr("transform", "translate(0,0)")
            .remove();
            this.draw(nextProps);
        }
    }

    render() {
        return (
            <div className="viz"/>
        )
    }

    zoomed() {
        this.state.svg.attr("transform", d3.event.transform)
    }
    
    draw(props) {
        if (!props || !props.planets || !props.planets.length) {
            return;
        }
        let spacetime = d3.select('.viz'); 
        let maxRadius = Math.min(this.state.width, this.state.height);
        // Space
        this.state.svg = spacetime.select("svg g");
        if (this.state.svg.empty()) {
            this.state.svg = spacetime.append("svg")
            .attr("width", this.state.width)
            .attr("height", this.state.height)
            .call(this.zoom)
            .call(this.zoom.transform, d3.zoomIdentity.translate(this.state.width/2,this.state.height/2))
            .append("g")
            .attr("transform", "translate(" + this.state.width / 2 + "," + this.state.height / 2 + ")");
        } 
        //Create stars and move them to proper locations
        let max_dist = 0;
        let max_st_rad = 0
        this.props.planets.map(pl => {
            if (pl.st_dist > max_dist) {max_dist = pl.st_dist} 
            if (pl.st_rad > max_st_rad) {max_st_rad = pl.st_rad} 
        });
        this.state.svg.selectAll('circle')
        .data(props.planets)
        .enter()
        .append("circle")
        .attr("id", planet => planet.pl_name)
        .attr("r", star => star.st_rad ? (star.st_rad / max_st_rad) * 10 : 3)
        .attr("transform", "translate(0,0)")
        .style("fill", pl => {return d3.interpolateSpectral(Math.min(pl.st_teff/10000,1))}) //"rgba(113, 170, 255, 1.0)"
        .transition()
        .duration(2000)
        .attr("transform", planet => {
            let radius = (planet.st_dist / max_dist) * maxRadius;
            return "translate(" + radius * Math.sin(planet.st_glon) + ", " + radius * Math.cos(planet.st_glon) + ")"
        });
    }
}