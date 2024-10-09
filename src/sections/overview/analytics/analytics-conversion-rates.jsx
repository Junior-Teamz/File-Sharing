import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
// utils
import { fNumber } from 'src/utils/format-number';
// components
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function AnalyticsConversionRates({ title, subheader, chart, ...other }) {
  const { colors, series, options } = chart;

  const chartSeries = series.map((i) => i.value);

  const chartOptions = useChart({
    colors,
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (value, { dataPointIndex }) => {
          const usageCount = series[dataPointIndex].usage_count; // Mengambil 'usage_count' dari series
          return `${fNumber(value)} pengguna `; // Menampilkan 'usage_count' di tooltip
        },
        title: {
          formatter: () => '',
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '28%',
        borderRadius: 2,
      },
    },
    xaxis: {
      categories: series.map((i) => i.label),
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ mx: 3 }}>
        <Chart
          type="bar"
          dir="ltr"
          series={[{ data: chartSeries }]}
          options={chartOptions}
          height={364}
        />
      </Box>
    </Card>
  );
}

AnalyticsConversionRates.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
