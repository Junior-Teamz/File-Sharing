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

  // Pastikan semua series menggunakan tipe 'bar'
  const modifiedSeries = series.map((s) => ({
    ...s,
    type: 'bar', // Set semua tipe series menjadi 'bar'
  }));

  const chartOptions = useChart({
    colors,
    plotOptions: {
      bar: {
        columnWidth: '20%', // Menentukan lebar kolom tetap
        distributed: false, // Membuat setiap batang memiliki lebar yang konsisten
      },
    },
    chart: {
      type: 'bar', // Mengubah seluruh chart menjadi chart batang
    },
    fill: {
      type: modifiedSeries.map((i) => i.fill),
    },
    labels,
    xaxis: {
      categories: labels,
      type: 'category', // Mengatur xaxis sebagai kategori
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return `${value.toFixed(0)} `; // Format angka pada tooltip
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
        <Chart dir="ltr" type="bar" series={modifiedSeries} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}

AnalyticsWebsiteVisits.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
