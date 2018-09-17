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

        let max_dist = 0
        this.props.planets.map(pl => {if (pl.st_dist > max_dist) {max_dist = pl.st_dist} });
        svg.selectAll('circle')
        .data(props.planets)
        .enter()
        .append("circle")
        .attr("id", planet => planet.pl_name)
        .attr("r", 3)
        .attr("transform", "translate(0,0)")
        .style("fill", "rgba(113, 170, 255, 1.0)")
        .transition()
        .duration(2000)
        .attr("transform", planet => {
            let radius = (planet.st_dist / max_dist) * maxRadius;
            return "translate(" + radius * Math.sin(planet.st_glon) + ", " + radius * Math.cos(planet.st_glon) + ")"
        });
    }
}