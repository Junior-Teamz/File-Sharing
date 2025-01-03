import axios from 'axios';
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
        window.location = '/403'; // Sesuaikan path sesuai kebutuhan
      } else if (error.response.status === 500) {
        // Redirect ke halaman 500
        window.location = '/500'; // Sesuaikan path sesuai kebutuhan
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

  ProfileUser:{
    update:'/api/user/update',
    updatePassword:'/api/user/update_password',
  },

  //user
  Tags: {
    ListTag: '/api/tag/index',
  },

  previewStorage: {
    storage: '/api/storageSizeUsage',
  },

  GetFileFolderShare: {
    UserShare: '/api//get_shared_folder_and_file',
  },
  SearchUser: {
    User: '/api/search/user',
  },
  Permissions: {
    PermissionsFile: '/api/permissions/files/grantPermission',
    getPermissionFolder: '/api/permissions/folders/grantPermission',
  },
  file: {
    upload: '/api/file/upload',
    delete: '/api/file/delete',
    getFavoritUser: '/api/file/favorite',
    addFavoritUser: '/api/file/addToFavorite',
    deleteFavoritUser: '/api/file/deleteFavorite',
    addTag: '/api/file/addTag',
    removeTag: '/api/file/removeTag',
    download: '/api/file/download',
    change: '/api/file/change_name',
  },
  folders: {
    detail: '/api/folders/detail/',
    getFavoritUser: '/api/folder/favorite',
    addFavoritUser: '/api/folder/addToFavorite',
    deleteFavoritUser: '/api/folder/deleteFavorite',
    list: '/api/folder', // folder list
    create: '/api/folder/create', // create folder
    delete: '/api/folder/delete', // delete folder
    edit: '/api/folder/update', // edit folder
    addTag: '/api/folder/addTag',
    removeTag: '/api/folder/removeTag',
  },

  //admin
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

  SuperAdminChart:{
    Instansi: '/api/admin/statistic_superadmin/storageUsagePerInstance',
    TagInstansi: '/api/admin/statistic_superadmin/tagUsedByInstance',
  },

  ChartTagFolderAndFile: {
    getChartTag: '/api/admin/tag/getTagUsageStatistic',
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
    delete: '/api/files/tag/remove',
    addTag: '/api/files/tag/add',
    removeTag: '/api/files/removeTag',
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
    addTag: '/api/folders/addTag',
    removeTag: '/api/folders/removeTag',
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
  AdminNews: {
    list: '/api/superadmin/news/all',
    detail: '/api/superadmin/news/getNewsDetail/',
    create: '/api/superadmin/news/create',
    Update: '/api/superadmin/news/update',
    UpdateStatus: '/api/superadmin/news/update/changeStatus',
    delete: '/api/superadmin/news/delete',
  },
};
