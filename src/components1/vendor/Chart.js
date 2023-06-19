import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import ChartDefaults from './ChartDefaults';

//
// Chart
//

function Chart({ layout, size, className, ...props }) {
  const classes = classNames('chart', layout && `chart-${layout}`, size && `chart-${size}`, className);

  useEffect(function () {
    ChartDefaults();
    
    return function () {
      const tooltip = document.getElementById('chart-tooltip');

      if (tooltip) {
        tooltip.parentNode.removeChild(tooltip);
      }
    };
  }, []);

  return <div className={classes} {...props} />;
}

Chart.propTypes = {
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

export { Chart, ChartLegend };
