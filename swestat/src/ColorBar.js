import React from 'react';
import './ColorBar.css';
const thousands = require('thousands');

class ColorBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: props.values
    };
  }

  roundTens(valMin, valMax) {
    return {
      valMinTens: Math.floor(valMin / 10) * 10,
      valMaxTens: Math.ceil(valMax / 10) * 10
    }
  }

  constructATags(valMin, valMax) {
    let aTagStr = '';

    const interval = [];
    for (let i = 11; i >= 0; i--) {
      interval.push(thousands(Math.round(valMin + i * (valMax - valMin) / 10)))
    }

    for (const value of interval) {
      aTagStr += `<p>${value}</p>`
    }
    return aTagStr
  }

  render() {
    const { valMin, valMax } = this.props.values;
    const { valMinTens, valMaxTens } = this.roundTens(valMin, valMax)
    const aTagStr = this.constructATags(Math.floor(valMin), Math.ceil(valMax))
    return (
      <React.Fragment>
        <div className='color-bar' dangerouslySetInnerHTML={{ __html: aTagStr }}>
        </div>
        <div id="unit">
          <p>[k SEK]</p>
        </div>
      </React.Fragment>
    );
  }
}

export default ColorBar;