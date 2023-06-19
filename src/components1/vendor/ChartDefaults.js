import { Chart } from 'react-chartjs-2';
import { getCSSVariable } from '../../helpers';

function externalTooltipLabelCallback(ctx) {
  const scale = ctx.chart.scales[ctx.dataset.yAxisID || 'y'];
  const label = ctx.chart.tooltip.dataPoints.length > 1 ? ' ' + ctx.dataset.label + ' ' : ' ';
  const content = label + scale.options.ticks.callback.apply(scale, [ctx.parsed.y, 0, []]);

  return content;
}

function getOrCreateTooltip(chart) {
  let tooltipEl = chart.canvas.parentNode.querySelector('div');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.setAttribute('id', 'chart-tooltip');
    tooltipEl.setAttribute('role', 'tooltip');
    tooltipEl.classList.add('popover', 'bs-popover-top');

    const arrowEl = document.createElement('div');
    arrowEl.classList.add('popover-arrow', 'translate-middle-x');

    const contentEl = document.createElement('div');
    contentEl.classList.add('popover-content');

    tooltipEl.appendChild(arrowEl);
    tooltipEl.appendChild(contentEl);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
}

function externalTooltipHandler(context) {
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.visibility = 'hidden';
    return;
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map((b) => b.lines);

    const headEl = document.createElement('div');
    titleLines.forEach((title) => {
      const headingEl = document.createElement('h3');
      headingEl.classList.add('popover-header', 'text-center', 'text-nowrap');

      const text = document.createTextNode(title);

      headingEl.appendChild(text);
      headEl.appendChild(headingEl);
    });

    const bodyEl = document.createElement('div');
    bodyLines.forEach((body, i) => {
      const colors = tooltip.labelColors[i];

      const indicatorEl = document.createElement('span');
      indicatorEl.classList.add('popover-body-indicator');
      indicatorEl.style.backgroundColor =
        chart.config.type === 'line' && colors.borderColor !== 'rgba(0,0,0,0.1)'
          ? colors.borderColor
          : colors.backgroundColor;

      const contentEl = document.createElement('div');
      contentEl.classList.add('popover-body', 'd-flex', 'align-items-center', 'text-nowrap');
      contentEl.classList.add(bodyLines.length > 1 ? 'justify-content-left' : 'justify-content-center');

      const text = document.createTextNode(body);

      contentEl.appendChild(indicatorEl);
      contentEl.appendChild(text);
      bodyEl.appendChild(contentEl);
    });

    const rootEl = tooltipEl.querySelector('.popover-content');

    // Remove old children
    while (rootEl.firstChild) {
      rootEl.firstChild.remove();
    }

    // Add new children
    rootEl.appendChild(headEl);
    rootEl.appendChild(bodyEl);
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.visibility = 'visible';
  tooltipEl.style.left = positionX + tooltip.caretX + 'px';
  tooltipEl.style.top = positionY + tooltip.caretY + 'px';
  tooltipEl.style.transform = 'translateX(-50%) translateY(-100%) translateY(-1rem)';
}

export default function ChartDefaults() {
  const colors = {
    gray: {
      300: getCSSVariable('--bs-chart-gray-300'),
      600: getCSSVariable('--bs-chart-gray-600'),
      700: getCSSVariable('--bs-chart-gray-700'),
      800: getCSSVariable('--bs-chart-gray-800'),
      900: getCSSVariable('--bs-chart-gray-900'),
    },
    primary: {
      100: getCSSVariable('--bs-chart-primary-100'),
      300: getCSSVariable('--bs-chart-primary-300'),
      700: getCSSVariable('--bs-chart-primary-700'),
    },
    black: getCSSVariable('--bs-dark'),
    white: getCSSVariable('--bs-white'),
    transparent: 'transparent',
  };

  const fonts = {
    base: 'Cerebri Sans',
  };

  // Global
  Chart.defaults.responsive = true;
  Chart.defaults.maintainAspectRatio = false;

  // Default
  Chart.defaults.color = getCSSVariable('--bs-chart-default-color');
  Chart.defaults.font.family = fonts.base;
  Chart.defaults.font.size = 13;

  // Layout
  Chart.defaults.layout.padding = 0;

  // Legend
  Chart.defaults.plugins.legend.display = false;

  // Point
  Chart.defaults.elements.point.radius = 0;
  Chart.defaults.elements.point.backgroundColor = colors.primary[700];

  // Line
  Chart.defaults.elements.line.tension = 0.4;
  Chart.defaults.elements.line.borderWidth = 3;
  Chart.defaults.elements.line.borderColor = colors.primary[700];
  Chart.defaults.elements.line.backgroundColor = colors.transparent;
  Chart.defaults.elements.line.borderCapStyle = 'rounded';

  // Bar
  Chart.defaults.elements.bar.backgroundColor = colors.primary[700];
  Chart.defaults.elements.bar.borderWidth = 0;
  Chart.defaults.elements.bar.borderRadius = 10;
  Chart.defaults.elements.bar.borderSkipped = false;
  Chart.defaults.datasets.bar.maxBarThickness = 10;

  // Arc
  Chart.defaults.elements.arc.backgroundColor = colors.primary[700];
  Chart.defaults.elements.arc.borderColor = getCSSVariable('--bs-chart-arc-border-color');
  Chart.defaults.elements.arc.borderWidth = 4;
  Chart.defaults.elements.arc.hoverBorderColor = getCSSVariable('--bs-chart-arc-hover-border-color');

  // Tooltips
  Chart.defaults.plugins.tooltip.enabled = false;
  Chart.defaults.plugins.tooltip.mode = 'index';
  Chart.defaults.plugins.tooltip.intersect = false;
  Chart.defaults.plugins.tooltip.external = externalTooltipHandler;
  Chart.defaults.plugins.tooltip.callbacks.label = externalTooltipLabelCallback;

  // Doughnut
  Chart.defaults.datasets.doughnut.cutout = '83%';
  Chart.overrides.doughnut.plugins.tooltip.callbacks.title = function (ctx) {
    return ctx[0].label;
  };
  Chart.overrides.doughnut.plugins.tooltip.callbacks.label = function (ctx) {
    const callbacks = ctx.chart.options.plugins.tooltip.callbacks;
    const before = callbacks.beforeLabel() || '';
    const after = callbacks.afterLabel() || '';

    return before + ctx.formattedValue + after;
  };

  // yAxis
  Chart.defaults.scales.linear.grid = {
    borderDash: [2],
    borderDashOffset: [2],
    color: getCSSVariable('--bs-chart-grid-line-color'),
    drawBorder: false,
    drawTicks: false,
  };

  Chart.defaults.scales.linear.ticks.beginAtZero = true;
  Chart.defaults.scales.linear.ticks.padding = 10;
  Chart.defaults.scales.linear.ticks.stepSize = 10;

  // xAxis
  Chart.defaults.scales.category.grid = {
    drawBorder: false,
    drawOnChartArea: false,
    drawTicks: false,
  };

  Chart.defaults.scales.category.ticks.padding = 20;
};
