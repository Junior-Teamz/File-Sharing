import axios from 'axios';
import { get, update } from 'lodash';
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: HOST_API,
  withCredentials: true,
});

// Function to set the token
export const setToken = (accessToken) => {
  if (accessToken) {
    sessionStorage.setItem('accessToken', accessToken);
  } else {
    sessionStorage.removeItem('accessToken');
  }
};

// Function to refresh access_token
const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await axiosInstance.post('/api/refreshToken', { token: refreshToken });
  const newAccessToken = response.data.accessToken; // Ambil access_token baru
  setToken(newAccessToken); // Simpan access_token baru
  return newAccessToken;
};

// Request interceptor untuk menyisipkan token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken'); // Ambil token dari sessionStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Tambahkan Bearer token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor untuk menangani refresh token
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    // Cek status respons
    if (error.response) {
      const originalRequest = error.config; // Simpan request yang gagal
      const refreshToken = originalRequest.refreshToken; // Ambil refresh_token dari request yang gagal
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Tandai request yang sudah dicoba

        try {
          const newAccessToken = await refreshAccessToken(refreshToken); // Dapatkan access_token baru
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`; // Tambahkan token baru ke header
          return axiosInstance(originalRequest); // Ulangi request dengan token baru
        } catch (refreshError) {
          // Tangani kesalahan saat refresh token
          return Promise.reject(refreshError);
        }
      } else if (error.response.status === 403) {
        // Redirect ke halaman 403
        // window.location = '/403'; // Sesuaikan path sesuai kebutuhan
      } else if (error.response.status === 500) {
        // Redirect ke halaman 500
        // window.location = '/500'; // Sesuaikan path sesuai kebutuhan
      }
    }
    return Promise.reject((error.response && error.response.data) || 'Something went wrong');
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  //auth login, log out, info
  auth: {
    me: '/api/user/index', // for info
    login: '/api/login', // for login
    logout: '/api/logout', // for log out
    refreshToken: '/api/refreshToken',
    sendLinkPassword: '/api/sendLinkResetPassword',
    resetPassword: '/api/resetPassword',
    // register: '/api/auth/register/',
  },

  //get data di landing page
  Legalbasis: {
    getLegal: '/api/public/legal_basis/all',
  },

  News: {
    getNews: '/api/public/news/all',
    getNewsSlug: '/api/public/news/detail/by_slug',
  },

  ProfileUser: {
    update: '/api/user/update',
    updatePassword: '/api/user/update_password',
  },

  //user
  Tags: {
    ListTag: '/api/tags/index',
  },

  previewStorage: {
    storage: '/api/storageSizeUsage',
  },

  GetFileFolderShare: {
    UserShare: '/api/get_shared_folder_and_file',
  },
  SearchUser: {
    User: '/api/search/user',
  },
  Permissions: {
    PermissionsFile: '/api/permissions/files/grant_permission',
    getPermissionFolder: '/api/permissions/folders/grant_permission',
  },
  file: {
    upload: '/api/files/upload',
    delete: '/api/files/delete',
    getFavoritUser: '/api/files/favorite/all',
    addFavoritUser: '/api/files/favorite/add',
    deleteFavoritUser: '/api/files/favorite/delete',
    addTag: '/api/files/tag/add',
    removeTag: '/api/files/tag/remove',
    download: '/api/files/download',
    change: '/api/files/change_name',
    generateLink: '/api/files/generate_share_link',
    movefile: '/api/files/move',
  },
  folders: {
    detail: '/api/folders/detail/',
    getFavoritUser: '/api/folders/favorite/all',
    addFavoritUser: '/api/folders/favorite/add',
    deleteFavoritUser: '/api/folders/favorite/delete',
    list: '/api/folders/all', // folders list
    create: '/api/folders/create', // create folders
    delete: '/api/folders/delete', // delete folders
    edit: '/api/folders/tag/update', // edit folders
    addTag: '/api/folders/tag/add',
    removeTag: '/api/folders/tag/remove',
  },

  //admin dan superadmin
  ChartFolder: {
    getChartFolder: '/api/admin/folder/storageSizeUsage',
  },

  FolderFileShare: {
    getShareFolderFile: '/api/get_shared_folder_and_file',
  },

  SearchUserAdmin: {
    User: '/api/search/user',
  },

  ChartFile: {
    getChartFile: '/api/admin/file/all',
  },

  ChartUser: {
    getChartUser: '/api/admin/users/countTotalUser',
  },

  ChartInstansi: {
    getUserInstansi: '/api/admin/instances/usage',
    getChartInstansi: '/api/admin/instance/countAll',
  },

  SuperAdminChart: {
    Instansi: '/api/admin/statistic_superadmin/storageUsagePerInstance',
    TagInstansi: '/api/admin/statistic_superadmin/tagUsedByInstance',
  },

  ChartTagFolderAndFile: {
    getChartTag: '/api/admin/tag/getTagUsageStatistic',
  },

  statistik: {
    getTagUsage: '/api/superadmin/statistics/tags/all_tag_usage',
    getStorage: 'api/superadmin/statistics/storage_usage',
    getFolderCount: 'api/superadmin/statistics/all_folder_count',
    getFileCount: 'api/superadmin/statistics/all_file_count',
    tagCount: '/api/superadmin/statistics/tags/count_all_tags',
    instanceUsage: '/api/superadmin/statistics/instances/usage',
    instanceAll: '/api/superadmin/statistics/instances/count_all_instance',
    storageUsageInstance: '/api/superadmin/statistics/instances/storage_usage_per_instance',
    tagUsageInstance: '/api/superadmin/statistics/instances/tags_used_by_instance',
    userCount: '/api/superadmin/users/count_total',
  },

  statatistikAdmin: {
    storageUsageInstance: '/api/admin/statistics/instances/usage',
    userCount: '/api/superadmin/statistics/users/count_all',
  },

  Legal: {
    ListLegal: '/api/public/legal_basis/all',
    SaveLegal: '/api/superadmin/legal_basis/save',
    UpdateLegal: '/api/superadmin/legal_basis/update',
    DeleteLegal: '/api/superadmin/legal_basis/delete',
  },

  NewsTag: {
    list: '/api/admin/news_tag/index',
    create: '/api/admin/news_tag/create',
    update: '/api/admin/news_tag/update',
    delete: '/api/admin/news_tag/delete',
  },

  files: {
    upload: '/api/files/upload',
    delete: '/api/files/delete',
    addTag: '/api/files/tag/add',
    removeTag: '/api/files/tag/remove',
    download: '/api/files/download',
    change: '/api/files/change_name',
    movefile: '/api/files/move',
    getFavorit: '/api/files/favorite/all',
    addFavorit: '/api/files/favorite/add',
    deleteFavorit: '/api/files/favorite/delete',
    generateLink: '/api/files/generate_share_link',
  },
  permission: {
    getPermissionFolder: '/api/permissions/folders/grant_permission',
    getPermissionFile: '/api/permissions/files/grant_permission',
  },
  tag: {
    create: '/api/superadmin/tags/create',
    index: '/api/superadmin/tags/index',
    delete: '/api/superadmin/tags/delete',
    update: '/api/superadmin/tags/update',
  },
  folder: {
    detail: '/api/folders/detail/',
    list: '/api/folders/all', // folders list
    create: '/api/folders/create', // create folders
    delete: '/api/folders/delete', // delete folders
    edit: '/api/folders/update', // edit folders
    addTag: '/api/folders/tag/add',
    removeTag: '/api/folders/tag/remove',
    getFavorit: '/api/folders/favorite/all',
    addFavorit: '/api/folders/favorite/add',
    deleteFavorit: '/api/folders/favorite/delete',
    generateLink: '/api/folders/generate_share_link',
  },
  users: {
    list: '/api/superadmin/users/list',
    create: '/api/superadmin/users/create',
    update: '/api/superadmin/users/update',
    delete: '/api/superadmin/users/delete',
    password: '/api/superadmin/users/password',
    getTotalUser: '/api/superadmin/users/countTotalUser',
    permissionAdmin: '/api/superadmin/users/admin_permissions',
  },
  instance: {
    list: '/api/superadmin/instances/index',
    create: '/api/superadmin/instances/create',
    update: '/api/superadmin/instances/update',
    delete: '/api/superadmin/instances/delete',
  },
  Section: {
    getSection: '/api/superadmin/instances/sections/all',
    getSectionById: '/api/superadmin/instances/sections/detail',
    createSection: '/api/superadmin/instances/sections/create',
    updateSection: '/api/superadmin/instances/sections/update',
    deleteSection: '/api/superadmin/instances/sections/delete',
  },
  AdminNews: {
    list: '/api/superadmin/news/all',
    detail: '/api/superadmin/news/getNewsDetail/',
    create: '/api/superadmin/news/create',
    Update: '/api/superadmin/news/update',
    UpdateStatus: '/api/superadmin/news/update/changeStatus',
    delete: '/api/superadmin/news/delete',
  },
  adminChart: {
    getStorageUsage: 'api/admin/statistics/intances/usage',
    getUserChart: 'api/admin/users/count_all',
  },
  Adminusers: {
    list: '/api/admin/users/list',
    create: '/api/admin/users/create',
    update: '/api/admin/users/update',
    delete: '/api/admin/users/delete',
    password: '/api/admin/users/update_user_password',
  },
  adminSection: {
    getSection: '/api/admin/sections/all',
    getSectionById: '/api/admin/sections/detail',
    createSection: '/api/admin/sections/create',
    updateSection: '/api/admin/sections/update',
    deleteSection: '/api/admin/sections/delete',
  },
  adminIntances: {
    getIntances: '/api/admin/instances/index',
    updatetIntances: '/api/admin/instances/update',
    deleteIntances: '/api/admin/instances/delete',
  },
};
