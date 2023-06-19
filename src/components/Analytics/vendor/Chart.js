import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import ChartDefaults from './ChartDefaults';

//
// Chart
//

class CustomChart extends React.Component {
  constructor(props) {
    super(props);

  }
  classes = classNames('chart', this.props.layout && `chart-${this.props.layout}`, this.props.size && `chart-${this.props.size}`, this.props.className);

  componentDidMount() {
    ChartDefaults();
    const tooltip = document.getElementById('chart-tooltip');

    if (tooltip) {
      tooltip.parentNode.removeChild(tooltip);
    }
  }

  render() {
    return <div className={this.classes} {...this.props} />;
  }
}

CustomChart.propTypes = {
  layout: PropTypes.string, // "appended" | "sparkline"
  size: PropTypes.string, // undefined | "sm"
};

//
// Chart legend
//

function ChartLegend({ data, className, ...props }) {
  const classes = classNames('chart-legend', className);

  const items = data.labels.map(function (label, index) {
    const color = data.datasets[0].backgroundColor[index];

    return <ChartLegendItem color={color} label={label} key={index} />;
  });

  return (
    <div className={classes} {...props}>
      {items}
    </div>
  );
}

//
// Chart legend item
//

function ChartLegendItem({ color, label }) {
  return (
    <div className="chart-legend-item">
      <ChartLegendIndicator color={color} /> {label}
    </div>
  );
}

//
// Chart legend indicator
//

function ChartLegendIndicator({ color }) {
  return <i className="chart-legend-indicator" style={{ backgroundColor: color }} />;
}

export { CustomChart, ChartLegend };
