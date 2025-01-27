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
  const { colors, series, labels, options } = chart;

  const chartOptions = useChart({
    colors,
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (value) => `${fNumber(value)} `,
      },
      title: {
        formatter: (index) => {
          const tagName = labels[index]; // Mengambil nama tag dari label
          const instanceNames = series.map((s) => s.name).join(", "); // Menggabungkan nama instansi
          return `${tagName} - ${instanceNames}`;
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '58%',
        borderRadius: 2,
      },
    },
    xaxis: {
      categories: labels, 
    },
    // yaxis: {
    //   labels: {
    //     formatter: (value) => fNumber(value),
    //   },
    // },
    ...options,
  });
  

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ mx: 3 }}>
        <Chart
          type="bar"
          dir="ltr"
          series={series}
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
