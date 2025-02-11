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
  useChartInstancesStorage,
  useTagInstances,
} from './useFetchChart';
import { fData } from 'src/utils/format-number';
// theme
import { bgGradient } from 'src/theme/css';
import { alpha, useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function OverviewAnalyticsView() {
  const settings = useSettingsContext();
  const theme = useTheme();

  const { data: Users } = useChartUsers();

  const { data, isFetching, isLoading, refetch } = useChartFolder();

  const { data: File } = useChartFile();

  const { data: chartTag } = useTagInstances();

  const { data: AllInstances } = useChartInstances();

  const { data: Storage } = useChartInstancesStorage();

  const { data: TagInstances } = useChartTag();

  const [selectedInstance, setSelectedInstance] = useState('all');

  const getTop5Storage = () => {
    if (!Storage) return [];
    return [...Storage].sort((a, b) => b.storage_usage_raw - a.storage_usage_raw).slice(0, 5);
  };

  const filteredStorageData =
    selectedInstance === 'all'
      ? getTop5Storage()
      : Storage?.filter((instance) => instance.instance_name === selectedInstance);

  const totalFileStorageBytes = fData(File?.count_size_all_files || '0kb');
  const totalFolderStorageBytes = fData(data?.formattedSize || '0kb');

  const totalStorageBytes = totalFileStorageBytes + totalFolderStorageBytes;

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
          name: 'Semua File',
          type: 'file',
          usedStorage: File?.count_size_all_files || '0kb',
          filesCount: File?.count_all_files,
          icon: <Box component="img" src="/assets/icons/files/ic_document.svg" />,
        },
        {
          name: 'Semua Folder',
          type: 'folder',
          usedStorage: data?.total_size_all_folders || '0kb',
          filesCount: data?.count_folder,
          icon: <Box component="img" src="/assets/icons/files/ic_folder.svg" />,
        },
      ]}
    />
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            ...bgGradient({
              color: alpha(
                theme.palette.background.paper,
                theme.palette.mode === 'light' ? 0.8 : 0.8
              ),
              imgUrl: '/assets/background/overlay_3.jpg',
            }),
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            position: 'absolute',
            filter: 'blur(20px)',
            WebkitFilter: 'blur(20px)',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
          }}
        />
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
          <Grid container spacing={2} md={12} lg={12}>
            <Grid xs={12} md={12} lg={12}>
              <FormControl fullWidth>
                <InputLabel>Filter Instansi</InputLabel>
                <Select
                  value={selectedInstance}
                  onChange={(e) => setSelectedInstance(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        overflowY: 'auto',
                      },
                    },
                  }}
                >
                  <MenuItem value="all">5 Teratas</MenuItem>
                  {Storage?.map((instance) => (
                    <MenuItem key={instance.instance_id} value={instance.instance_name}>
                      {instance.instance_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={12} lg={12}>
              <AnalyticsWebsiteVisits
                title="Statistik Penyimpanan"
                subheader={
                  selectedInstance === 'all'
                    ? 'Top 5 Penyimpanan Teratas'
                    : `Data Instannsi untuk ${selectedInstance}`
                }
                isStorage={selectedInstance === 'all'} // Storage hanya berlaku untuk instance 'all'
                chart={{
                  labels: filteredStorageData?.map((item) => item.instance_name) || [],
                  series:
                    selectedInstance === 'all'
                      ? [
                          {
                            name: 'Penyimpanan Digunakan',
                            type: 'column',
                            fill: 'solid',
                            data: filteredStorageData?.map((item) => item.storage_usage_raw) || [],
                          },
                        ]
                      : [
                          {
                            name: 'Total File',
                            type: 'column',
                            fill: 'solid',
                            data: filteredStorageData?.map((item) => item.total_files) || [],
                          },
                          {
                            name: 'Total Folder',
                            type: 'column',
                            fill: 'gradient',
                            data: filteredStorageData?.map((item) => item.total_folders) || [],
                          },
                          {
                            name: 'Penyimpanan Digunakan',
                            type: 'area',
                            fill: 'gradient',
                            data: filteredStorageData?.map((item) => item.storage_usage_raw) || [],
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
              subheader="Data Tag paling banyak dipakai oleh instansi"
              chart={{
                series: TagInstances.map((tag) => ({
                  name:
                    tag.instances.length > 0
                      ? tag.instances.map((instance) => instance.instance_name).join(', ')
                      : 'No Instances', // Nama default jika tidak ada instance
                  data:
                    tag.instances.length > 0
                      ? tag.instances.map((instance) => {
                          // Pastikan tag_use_count valid
                          return typeof instance.tag_use_count === 'number' &&
                            !isNaN(instance.tag_use_count)
                            ? instance.tag_use_count
                            : 0;
                        })
                      : [0], // Jika tidak ada instance, setel data ke [0]
                })),
                labels: TagInstances.map((tag) => tag.tag_name), // Menggunakan nama tag sebagai label
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
      </Box>
    </Container>
  );
}
