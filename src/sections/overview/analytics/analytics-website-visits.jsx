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

  // Modifikasi series agar semua memiliki tipe 'bar'
  const modifiedSeries = series.map((s) => ({
    ...s,
    type: 'bar', // Semua series menjadi bar
  }));

  const chartHeight = 400; // Tinggi chart tetap

  const chartOptions = useChart({
    colors,
    plotOptions: {
      bar: {
        columnWidth: '100%',  // Batang akan memanfaatkan seluruh ruang untuk setiap kategori
        horizontal: true,     // Batang horizontal (ke kanan)
        distributed: false,   // Tidak ada distribusi, hanya satu batang per kategori
      },
    },
    chart: {
      type: 'bar',
    },
    fill: {
      type: modifiedSeries.map((i) => i.fill), // Menentukan jenis fill untuk masing-masing series
    },
    labels,
    xaxis: {
      categories: labels,
      type: 'category',
    },
    yaxis: {
      title: {
        text: 'Total', // Judul untuk sumbu Y
      },
    },
    tooltip: {
      shared: true, // Menampilkan data dari semua series
      intersect: false, // Menonaktifkan intersect untuk memungkinkan shared tooltip
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return `${value.toFixed(0)} `;
          }
          return value;
        },
      },
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const tooltipData = [];
        // Ambil data untuk setiap series dalam satu batang
        modifiedSeries.forEach((seriesItem, index) => {
          const dataValue = series[index][dataPointIndex];
          tooltipData.push(`${seriesItem.name}: ${dataValue}`);
        });

        return `<div style="padding: 10px;">
                  <strong>${labels[dataPointIndex]}</strong><br/>
                  ${tooltipData.join('<br/>')}
                </div>`;
      },
    },
    stacked: true, // Mengaktifkan opsi stacking untuk membuat satu batang panjang
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
