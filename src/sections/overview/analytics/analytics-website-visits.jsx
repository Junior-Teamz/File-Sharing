import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
// components
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function AnalyticsWebsiteVisits({ title, subheader, chart, ...other }) {
  const { labels, colors, series, options } = chart;

  // Ensure all series are of type 'bar'
  const modifiedSeries = series.map((s) => ({
    ...s,
    type: 'bar',
  }));

  // Set the chart height conditionally based on the number of series
  const chartHeight = series.length >= 5 ? 400 : 400;

  const chartOptions = useChart({
    colors,
    plotOptions: {
      bar: {
        columnWidth: '20%',
        horizontal: true,
        distributed: false,
      },
    },
    chart: {
      type: 'bar',
    },
    fill: {
      type: modifiedSeries.map((i) => i.fill),
    },
    labels,
    xaxis: {
      categories: labels,
      type: 'category',
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return `${value.toFixed(0)} `;
          }
          return value;
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ p: 3, pb: 1 }}>
        <Chart dir="ltr" type="bar" series={modifiedSeries} options={chartOptions} height={chartHeight} />
      </Box>
    </Card>
  );
}

AnalyticsWebsiteVisits.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
