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
  useChartUsers,
  useChartFile,
} from './useFetchChart';

// ----------------------------------------------------------------------

const GB = 1000000000 * 24;

export default function OverviewAnalyticsView() {
  const settings = useSettingsContext();

  const { data: Users } = useChartUsers();
  console.log(Users);

  const { data, isFetching, isLoading, refetch } = useChartFolder();
  console.log(data);

  const { data: File } = useChartFile();
  console.log(File);

  const { data: AllInstances } = useChartInstances();
  console.log(AllInstances);

  const { data: Instances } = useChartUserInstances();
  console.log(Instances);

  const { data: chartTag } = useChartTag();
  console.log(chartTag);

  function convertToBytes(sizeString) {
    if (!sizeString) return 0;

    const size = parseFloat(sizeString);
    if (sizeString.toLowerCase().includes('kb')) {
      return size * 1024; // Convert KB to bytes
    } else if (sizeString.toLowerCase().includes('mb')) {
      return size * 1024 * 1024; // Convert MB to bytes
    } else if (sizeString.toLowerCase().includes('gb')) {
      return size * 1024 * 1024 * 1024; // Convert GB to bytes
    }
    return size; // Return size directly if it's already in bytes
  }

  function formatSize(bytes) {
    if (bytes >= 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    } else if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    } else if (bytes >= 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else {
      return bytes + ' B';
    }
  }

  // Convert file and folder sizes to bytes
  const totalFileStorageBytes = convertToBytes(File?.data?.total_size || '0kb'); // Convert file size to bytes
  const totalFolderStorageBytes = convertToBytes(data?.data?.formattedSize || '0kb'); // Convert folder size to bytes

  // Calculate total storage in bytes
  const totalStorageBytes = totalFileStorageBytes + totalFolderStorageBytes;

  // Format the total storage size to KB, MB, or GB dynamically
  const totalStorageFormatted = formatSize(totalStorageBytes);

  const renderStorageOverview = (
    <FileStorageOverview
      total={totalStorageBytes} // Pass the total storage as a number
      chart={{
        series: [totalStorageBytes], // Use byte values for accurate chart series
      }}
      data={[
        // {
        //   name: 'Images',
        //   usedStorage: GB / 2,
        //   filesCount: 223,
        //   icon: <Box component="img" src="/assets/icons/files/ic_img.svg" />,
        // },
        // {
        //   name: 'Media',
        //   usedStorage: GB / 5,
        //   filesCount: 223,
        //   icon: <Box component="img" src="/assets/icons/files/ic_video.svg" />,
        // },
        {
          name: 'All File',
          usedStorage: File?.data?.total_size || '0kb',
          filesCount: File?.data?.total_file,
          icon: <Box component="img" src="/assets/icons/files/ic_document.svg" />,
        },
        {
          name: 'All Folder',
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
      
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="All Users"
            total={
              Users?.total_user_count !== undefined && Users?.total_user_count !== null
                ? Users.total_user_count
                : 0
            }
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Instansi"
            total={
              AllInstances?.instance_count !== undefined && AllInstances?.instance_count !== null
                ? AllInstances.instance_count
                : 0
            }
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_company.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Admin"
            total={
              Users?.admin_role_count !== undefined && Users?.admin_role_count !== null
                ? Users.admin_role_count
                : 0
            }
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_admin.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="User"
            total={
              Users?.user_role_count !== undefined && Users?.user_role_count !== null
                ? Users.user_role_count
                : 0
            }
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
                  name: 'Total All User',
                  type: 'column',
                  fill: 'solid', // Fill solid untuk total semua pengguna
                  data: Instances?.data?.map((item) => item.user_count.user_total) || [],
                },
                {
                  name: 'Total Role Admin ',
                  type: 'column',
                  fill: 'gradient', // Fill gradient untuk total pengguna admin
                  data: Instances?.data?.map((item) => item.user_count.role_admin_total) || [],
                },
                {
                  name: 'Total Role User',
                  type: 'column',
                  fill: 'solid', // Fill solid untuk total pengguna reguler
                  data: Instances?.data?.map((item) => item.user_count.role_user_total) || [],
                },
                {
                  name: 'Total File',
                  type: 'area',
                  fill: 'gradient', // Fill gradient untuk total file
                  data: Instances?.data?.map((item) => item.file_total) || [],
                },
                {
                  name: 'Total Folder',
                  type: 'line',
                  fill: 'solid', // Fill solid untuk total folder
                  data: Instances?.data?.map((item) => item.folder_total) || [],
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
            title="Statistik Tag"
            subheader="Data Tag paling banyak dipakai dan total file, folder di dalam tag"
            chart={{
              series: [
                {
                  name: 'Total Pengguna',
                  data: chartTag?.data?.map((tag) => tag?.total_usage_count) || [],
                },
                {
                  name: 'Total File',
                  data: chartTag?.data?.map((tag) => tag?.file_usage_count) || [],
                },
                {
                  name: 'Total Folder',
                  data: chartTag?.data?.map((tag) => tag?.folder_usage_count) || [],
                },
              ],
              labels: chartTag?.data?.map((tag) => tag?.name) || [],
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
