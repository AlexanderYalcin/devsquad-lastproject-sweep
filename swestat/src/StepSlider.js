import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/lab/Slider';

const styles = {
  root: {
    width: 350,
  },
  slider: {
    padding: '22px 0px',
  },
};

class StepSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };

    this.stepHandler = props.handler;
    this.countiesData = props.countiesData;
    this.startYear = props.startYear;
    
    this.state.value = this.countiesData.length - 1;
  }
  
  componentDidUpdate() {
    this.stepHandler = this.props.handler;
    this.countiesData = this.props.countiesData;
    this.startYear = this.props.startYear;
  }

  handleChange = (event, value) => {
    this.setState({ value });
    this.stepHandler(value, this.countiesData)
  };
  
  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <Slider
          classes={{ container: classes.slider }}
          value={value}
          min={0}
          max={this.countiesData.length - 1}
          step={1}
          onChange={this.handleChange}
        />
        <p>{parseInt(this.startYear) + value}</p>
      </div>
    );
  }
}

StepSlider.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StepSlider);