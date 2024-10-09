// @mui
import Grid from '@mui/system/Unstable_Grid/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// _mock
import {
  _analyticTasks,
  _analyticPosts,
  _analyticTraffic,
  _analyticOrderTimeline,
} from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
import { Box } from '@mui/material';
//
import AnalyticsNews from '../analytics-news';
import AnalyticsTasks from '../analytics-tasks';
import AnalyticsCurrentVisits from '../analytics-current-visits';
import AnalyticsOrderTimeline from '../analytics-order-timeline';
import AnalyticsWebsiteVisits from '../analytics-website-visits';
import AnalyticsWidgetSummary from '../analytics-widget-summary';
import AnalyticsTrafficBySite from '../analytics-traffic-by-site';
import AnalyticsCurrentSubject from '../analytics-current-subject';
import AnalyticsConversionRates from '../analytics-conversion-rates';

//storage
import FileStorageOverview from '../../../file-manager/file-storage-overview';

//hooks
import {
  useChartFolder,
  useChartTag,
  useChartUserInstances,
  useChartInstances,
} from './useFetchChart';

// ----------------------------------------------------------------------

const GB = 1000000000 * 24;

export default function OverviewAnalyticsView() {
  const settings = useSettingsContext();

  const { data, isFetching, isLoading, refetch } = useChartFolder();
  console.log(data);

  const { data: AllInstances } = useChartInstances();
  console.log(AllInstances);

  const { data: Instances } = useChartUserInstances();
  console.log(Instances);

  const { data: chartTag } = useChartTag();
  console.log(chartTag);

  const renderStorageOverview = (
    <FileStorageOverview
      total={GB}
      chart={{
        series: 76,
      }}
      data={[
        {
          name: 'Images',
          usedStorage: GB / 2,
          filesCount: 223,
          icon: <Box component="img" src="/assets/icons/files/ic_img.svg" />,
        },
        {
          name: 'Media',
          usedStorage: GB / 5,
          filesCount: 223,
          icon: <Box component="img" src="/assets/icons/files/ic_video.svg" />,
        },
        {
          name: 'Documents',
          usedStorage: GB / 5,
          filesCount: 223,
          icon: <Box component="img" src="/assets/icons/files/ic_document.svg" />,
        },
        {
          name: 'Folder',
          usedStorage: data.data?.formattedSize || '0kb', // Dynamically set folder storage from useChartFolder response
          filesCount: 223,
          icon: <Box component="img" src="/assets/icons/files/ic_folder.svg" />,
        },
      ]}
    />
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="All Users"
            total={1352831}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Instansi"
            total={AllInstances?.instance_count}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_company.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Admin"
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_admin.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="User"
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_user.png" />}
          />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <AnalyticsWebsiteVisits
            title="Statistik Instansi"
            subheader="Data Instansi dan Total User, File, Folder"
            chart={{
              labels: Instances?.data?.map((item) => item.name) || [], // Mengambil nama instansi
              series: [
                {
                  name: 'Total Users',
                  type: 'column',
                  fill: 'solid',
                  data: Instances?.data?.map((item) => item.user_total) || [], // Total user
                },
                {
                  name: 'Total Files',
                  type: 'area',
                  fill: 'gradient',
                  data: Instances?.data?.map((item) => item.file_total) || [], // Total file
                },
                {
                  name: 'Total Folders',
                  type: 'line',
                  fill: 'solid',
                  data: Instances?.data?.map((item) => item.folder_total) || [], // Total folder
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <Box>{renderStorageOverview}</Box>
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Tag paling banyak di pakai"
            subheader="(+43%) than last year"
            chart={{
              series:
                chartTag?.data?.map((tag) => ({
                  label: tag.name,
                  value: tag.usage_count,
                })) || [],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Current Visits"
            chart={{
              series: [
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ],
            }}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="Current Subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid> */}

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsNews title="News" list={_analyticPosts} />
        </Grid>
      </Grid>
    </Container>
  );
}
