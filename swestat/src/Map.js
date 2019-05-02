import React, { Component } from 'react';
import './Map.css';
import * as d3 from 'd3'
import StepSlider from './StepSlider.js'
import countiesJson from './swedish_counties.geo.json'
import ColorBar from './ColorBar';
import Loader from 'react-loader-spinner';

function interpolateColors(startColorHex, goalColorHex, steps) {
  const startColor = hexToRgb(startColorHex);
  const goalColor = hexToRgb(goalColorHex);

  const R = startColor.r;
  const G = startColor.g;
  const B = startColor.b;

  const targetR = goalColor.r;
  const targetG = goalColor.g;
  const targetB = goalColor.b;

  const diffR = targetR - R;
  const diffG = targetG - G;
  const diffB = targetB - B;

  const gradientList = [];

  for (let i = 0; i < steps + 1; i++) {
    const newR = R + (diffR * i / steps)
    const newG = G + (diffG * i / steps)
    const newB = B + (diffB * i / steps)

    gradientList.push(rgbToHex(newR, newG, newB));
  }
  return gradientList
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

function getWindowHeight() {
  const windowHeight = window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  return windowHeight * 0.9;
}

function rgbToHex(red, green, blue) {
  var rgb = blue | (green << 8) | (red << 16);
  return '#' + (0x1000000 + rgb).toString(16).slice(1)
}

function calcMinMax(countiesObj) {
  const countiesDataArr = Object.values(countiesObj).filter((el) => el !== -1);

  const valMin = Math.min(...countiesDataArr);
  const valMax = Math.max(...countiesDataArr);

  return { valMin: valMin, valMax: valMax }
}

let path;

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      countiesData: null,
      countiesMainGroup: null,
      values: null,
      isLoading: false,
      startYear: null,
      windowWidth: Math.round(getWindowHeight() * 0.45),
      windowHeight: getWindowHeight(),
    }
    this.stepChangeHandler = this.stepChangeHandler.bind(this);

    // this.mapDataEndPoint = props.mapDataEndPoint;
  }

  addMap(width, height, countiesData) {
    const values = calcMinMax(countiesData);
    this.setState({ values });
    const svgCounties = d3.select("#county-map").append("svg")
      .attr("width", width)
      .attr("height", height)

    const countiesMainGroup = svgCounties.append("g");

    // this.setState({ isLoading: false });

    function onHoover(name, id) {
      // console.log(name, id)
    }
    window.onHoover = onHoover;

    // centering
    const center = d3.geoCentroid(countiesJson)	//GeoJSON
    let scale = 1;
    let offset = [width / 2.4, height / 7.08];
    let projection = d3.geoMercator()
      .scale(1.0)
      .center(center)
      .translate(offset);

    // create the path
    path = d3.geoPath().projection(projection);

    // using the path determine the bounds of the current map and use 
    // these to determine better values for the scale and translation
    const bounds = path.bounds(countiesJson);

    const hscale = scale * width / (bounds[1][0] - bounds[0][0]);
    const vscale = scale * height / (bounds[1][1] - bounds[0][1]);
    scale = (hscale < vscale) ? hscale : vscale;
    offset = [width - (bounds[0][0] + bounds[1][0]) / 2,
    height - (bounds[0][1] + bounds[1][1]) / 2];

    // new projection
    projection = d3.geoMercator().center(center).scale(scale).translate(offset);

    path = path.projection(projection);
    var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    let noData = [];

    countiesMainGroup.selectAll("path")
      .data(countiesJson.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", function (d) {
        if (countiesData[d.properties.k_id] < 0) {
          noData.push(d.properties.k_id);
          return "#e22424";
        } else {
          const colorInterval = interpolateColors('#ffffff', '#08306b', 100)
          const colorIndex = Math.round(Math.abs(countiesData[d.properties.k_id] - values.valMin) / (values.valMax - values.valMin) * 100)

          return colorInterval[colorIndex];
        }
      })
      .on("mouseover", function (d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);

        if (noData.includes(d.properties.k_id)) {
          tooltip.html(`${d.properties.name} <br/> NO DATA`)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        } else {
          tooltip.html(d.properties.name)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        }
      })
      .on("mouseout", function (d) {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0)
      });

    d3.select("#county-map svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr('viewBox', '0 0 ' + Math.min(width, height) + ' ' + Math.min(width, height))
      .classed("map-responsive", true);

    this.setState({ countiesMainGroup });
  }

  updateMap(countiesData) {
    const values = calcMinMax(countiesData);
    this.setState({ values });

    var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    let noData = [];
    this.state.countiesMainGroup.selectAll("path")
      .attr("fill", function (d) {
        if (countiesData[d.properties.k_id] < 0) {
          noData.push(d.properties.k_id);
          return "#e22424";
        } else {
          const colorInterval = interpolateColors('#ffffff', '#08306b', 100)
          const colorIndex = Math.round(Math.abs(countiesData[d.properties.k_id] - values.valMin) / (values.valMax - values.valMin) * 100)
          // const colorIndex = Math.round(countiesData[d.properties.k_id] - values.valMin) / (values.valMax - values.valMin) * 100

          return colorInterval[colorIndex];
        }
      })
      .on("mouseover", function (d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);

        if (noData.includes(d.properties.k_id)) {
          tooltip.html(`${d.properties.name} <br/> NO DATA`)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        } else {
          tooltip.html(d.properties.name)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        }
      })
      .on("mouseout", function (d) {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });
  }

  stepChangeHandler(value) {
    // this.setState({ isLoading: true });
    this.updateMap(this.state.countiesData[value])
    // this.setState({ isLoading: false });
  }

  removeMap() {
    const mapOuter = document.getElementById("county-map")
    mapOuter.remove();

    const outerDiv = document.getElementsByClassName('map-container')[0];
    const newMapDiv = document.createElement('div');
    newMapDiv.id = "county-map";
    outerDiv.appendChild(newMapDiv);

  }

  async componentWillReceiveProps() {
    this.removeMap();
    if (this.props.mapDataEndPoint === '/salary') {
      document.getElementById('unit').innerText = '[k SEK]'
    } else if (this.props.mapDataEndPoint === '/population') {
      document.getElementById('unit').innerText = '[n. of people]'
    }

    await this.fetchAndUpdateMap()

  }

  async fetchAndUpdateMap() {
    let result;
    await fetch(this.props.mapDataEndPoint)
      .then(response => response.json())
      .then(res => result = res)

    const countiesDataAll = []
    let countiesData = {};
    for (let i = 0; i < result.data['0114'].length; i++) {
      countiesData = {};
      for (const county in result.data) {
        const val = Number.parseFloat(result.data[county][i].value);
        countiesData[county] = Number.isFinite(val) ? val : -1;
      }
      countiesDataAll.push(countiesData);
    }

    this.setState({ countiesData: countiesDataAll });
    this.setState({ startYear: result.startYear });

    const values = calcMinMax(countiesData);
    this.setState({ values: values });

    this.setState({ isLoading: false })
    this.addMap(this.state.windowWidth, this.state.windowHeight, this.state.countiesData[this.state.countiesData.length - 1]);
  }

  async componentWillMount() {
    this.setState({ isLoading: true });
    await this.fetchAndUpdateMap();
  }
  render() {
    const { values, countiesData, isLoading, startYear } = this.state;
    if (isLoading) {
      return (
        <div className="loader">

          <Loader
            type="Puff"
            color="#7FB069"
            height="100"
            width="100"
          />
        </div>
      )
    }

    return (
      <React.Fragment>
        <div className="outer-map">
          <div className="map-container">
            <div id="county-map"></div>
            <ColorBar key={values} values={values} />
          </div>
        </div>

        <div className="footer">
          <StepSlider handler={this.stepChangeHandler} countiesData={countiesData} startYear={startYear} />
        </div>

      </React.Fragment>
    );
  }
}

export default Map;
