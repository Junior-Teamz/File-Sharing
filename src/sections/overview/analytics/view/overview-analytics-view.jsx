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
import React, { useState } from 'react';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

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
import { fData } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function OverviewAnalyticsView() {
  const settings = useSettingsContext();

  const { data: Users } = useChartUsers();

  const { data, isFetching, isLoading, refetch } = useChartFolder();

  const { data: File } = useChartFile();

  const { data: AllInstances } = useChartInstances();

  const { data: Instances } = useChartUserInstances();

  const { data: chartTag } = useChartTag();

  const [selectedInstance, setSelectedInstance] = useState('all');

  // Sort and filter to get top 5 instances by total user, file, or folder
  const getTop5Instances = () => {
    if (!Instances?.data) return [];
    return [...Instances.data]
      .sort((a, b) => {
        const totalA = a.user_count.user_total + a.file_total + a.folder_total;
        const totalB = b.user_count.user_total + b.file_total + b.folder_total;
        return totalB - totalA; // Sort descending by the combined total
      })
      .slice(0, 5); // Get top 5
  };

  // Filter data based on the selected instance
  const filteredData =
    selectedInstance === 'all'
      ? getTop5Instances() // Show top 5 when 'all' is selected
      : Instances?.data?.filter((instance) => instance.name === selectedInstance);

  function convertToBytes(sizeString) {
    if (!sizeString) return 0;

    const size = parseFloat(sizeString);
    if (sizeString.toLowerCase().includes('kb')) {
      return size * 1024; // Convert KB to bytes
    } else if (sizeString.toLowerCase().includes('mb')) {
      return size * 1024 * 1024; // Convert MB to bytes
    } else if (sizeString.toLowerCase().includes('gb')) {
      return size * 1024 * 1024 * 1024;
    }
    return size;
  }

  const totalFileStorageBytes = convertToBytes(File?.data?.total_size || '0kb'); // Convert file size to bytes
  const totalFolderStorageBytes = convertToBytes(data?.data?.formattedSize || '0kb'); // Convert folder size to bytes

  const totalStorageBytes = totalFileStorageBytes + totalFolderStorageBytes;

  // Use fData to format the total storage
  const totalStorageFormatted = fData(totalStorageBytes);

  const renderStorageOverview = (
    <FileStorageOverview
      total={totalStorageBytes} 
      
      chart={{
        series: [totalStorageBytes], 
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
          usedStorage: data.data?.formattedSize || '0kb',
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
      ></Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Seluruh User"
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
          <Grid xs={12}>
            <FormControl fullWidth>
              <InputLabel>Filter Instansi</InputLabel>
              <Select
                value={selectedInstance}
                onChange={(e) => setSelectedInstance(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200, // Maksimal tinggi dropdown
                      overflowY: 'auto', // Tambahkan scroll jika melebihi maksimal tinggi
                    },
                  },
                }}
              >
                <MenuItem value="all">5 Teratas</MenuItem>
                {Instances?.data?.map((instance) => (
                  <MenuItem key={instance.id} value={instance.name}>
                    {instance.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid xs={12} md={12} lg={12}>
            <AnalyticsWebsiteVisits
              title="Statistik Instansi"
              subheader="Data Instansi dan Total User, File, Folder"
              chart={{
                labels: filteredData?.map((item) => item.name) || [],
                series: [
                  {
                    name: 'Total All User',
                    type: 'column',
                    fill: 'solid',
                    data: filteredData?.map((item) => item.user_count.user_total) || [],
                  },
                  {
                    name: 'Total Role Admin',
                    type: 'column',
                    fill: 'gradient',
                    data: filteredData?.map((item) => item.user_count.role_admin_total) || [],
                  },
                  {
                    name: 'Total Role User',
                    type: 'column',
                    fill: 'solid',
                    data: filteredData?.map((item) => item.user_count.role_user_total) || [],
                  },
                  {
                    name: 'Total File',
                    type: 'area',
                    fill: 'gradient',
                    data: filteredData?.map((item) => item.file_total) || [],
                  },
                  {
                    name: 'Total Folder',
                    type: 'line',
                    fill: 'solid',
                    data: filteredData?.map((item) => item.folder_total) || [],
                  },
                ],
              }}
            />
          </Grid>
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

        {/* <Grid xs={12} md={6} lg={4}>
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
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={8}>
          <AnalyticsNews title="News" list={_analyticPosts} />
        </Grid> */}
      </Grid>
    </Container>
  );
}
