import React, {Component } from "react";
import * as d3 from "d3";

export default class GalaxyViz extends Component {
    constructor() {
        super()
        this.draw = this.draw.bind(this)
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

    
    draw(props) {
        if (!props || !props.planets || !props.planets.length) {
            return;
        }
        let spacetime = d3.select('.viz'); 
        let width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        let height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        let maxRadius = Math.min(width, height);
        // Space
        let svg = spacetime.select("svg g");
        if (svg.empty()) {
            svg = spacetime.append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        } 

        let max_dist = 0;
        let max_st_rad = 0
        this.props.planets.map(pl => {
            if (pl.st_dist > max_dist) {max_dist = pl.st_dist} 
            if (pl.st_rad > max_st_rad) {max_st_rad = pl.st_rad} 
        });
        svg.selectAll('circle')
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