import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
// components
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function AnalyticsWebsiteVisits({ title, subheader, chart, isStorage, ...other }) {
  const { labels, colors, series, options } = chart;

  // Fungsi untuk mengonversi nilai jika data adalah ukuran storage
  const formatStorage = (value) => {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)} MB`; // Konversi ke MB jika >= 1,000,000 bytes
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(2)} KB`; // Konversi ke KB jika >= 1,000 bytes
    }
    return `${value} bytes`; // Nilai default dalam bytes
  };

  // Fungsi untuk menampilkan nilai secara langsung (untuk total file atau folder)
  const formatCount = (value) => `${value} items`;

  // Tentukan apakah data adalah storage atau hanya hitungan
  const dataFormatter = isStorage ? formatStorage : formatCount;

  const modifiedSeries = series.map((s) => ({
    ...s,
    type: 'bar',
    data: s.data.map((value) => (isStorage ? value / 1e3 : value)), 
  }));

  const chartOptions = useChart({
    ...options,
    colors,
    plotOptions: {
      bar: {
        columnWidth: '20%',
        distributed: false,
      },
    },
    chart: {
      type: 'bar',
    },
    fill: {
      type: modifiedSeries.map((i) => i.fill || 'solid'),
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
        formatter: (value) => (typeof value !== 'undefined' ? dataFormatter(value * (isStorage ? 1e3 : 1)) : value),
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => dataFormatter(value * (isStorage ? 1e3 : 1)),
      },
    },
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
  isStorage: PropTypes.bool, // Tambahan prop untuk menentukan apakah data adalah storage atau tidak
};
