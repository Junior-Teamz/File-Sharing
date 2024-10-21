import axios from 'axios';
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API, withCredentials: true,});

// Function to set the token
export const setToken = (accessToken, refreshToken) => {
  if (accessToken) {
    sessionStorage.setItem('accessToken', accessToken);
  } else {
    sessionStorage.removeItem('accessToken');
  }

  if (refreshToken) {
    sessionStorage.setItem('refreshToken', refreshToken);
  } else {
    sessionStorage.removeItem('refreshToken');
  }
};

// Function to get refresh token
const getRefreshToken = () => {
  return sessionStorage.getItem('refreshToken'); // Ambil refresh_token dari sessionStorage
};

// Function untuk refresh access_token
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await axiosInstance.post('/api/refreshToken', { token: refreshToken });
  const newAccessToken = response.data.accessToken; // Ambil access_token baru
  setToken(newAccessToken, refreshToken); // Simpan access_token baru
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
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Tandai request yang sudah dicoba

        try {
          const newAccessToken = await refreshAccessToken(); // Dapatkan access_token baru
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`; // Tambahkan token baru ke header
          return axiosInstance(originalRequest); // Ulangi request dengan token baru
        } catch (refreshError) {
          // Tangani kesalahan saat refresh token
          handleLogout(); // Misalnya, logout pengguna
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
    me: '/api/index', // for info
    login: '/api/login', // for login
    logout: '/api/logout', // for log out
    refreshToken: '/api/refreshToken',
    // register: '/api/auth/register/',
  },

  // previewImage: {
  //   preview: (hashedId) => `/api/file/preview/${hashedId}`,
  // },
  previewVideo: {
    getVideo: '/api/file/videoStream/',
  },
  previewImage: {
    preview: '/api/file/preview/',
  },

  previewStorage:{
    storage:'/api/storageSizeUsage'
  },

  //get data di landing page
  Legalbasis: {
    getLegal: '/api/legal_basis/getAllLegalBasis',
  },

  News: {
    getNews: '/api/news/getAllNews',
    getNewsSlug: '/api/news/detail/slug',
  },

  //user
  Tags: {
    ListTag: '/api/tag/index',
  },

  GetFileFolderShare: {
    UserShare: '/api/getSharedFolderAndFile',
  },
  SearchUser: {
    User: '/api/searchUser',
  },
  Permissions: {
    PermissionsFile: '/api/permission/file/grantPermission',
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
    detail: '/api/folder/info/',
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
    getShareFolderFile: '/api/admin/getSharedFolderAndFile',
  },

  SearchUserAdmin: {
    User: '/api/admin/searchUser',
  },

  ChartFile: {
    getChartFile: '/api/admin/file/all',
  },

  ChartUser: {
    getChartUser: '/api/admin/users/countTotalUser',
  },

  ChartInstansi: {
    getUserInstansi: '/api/admin/instance/getInstanceUsageStatistic',
    getChartInstansi: '/api/admin/instance/countAll',
  },

  ChartTagFolderAndFile: {
    getChartTag: '/api/admin/tag/getTagUsageStatistic',
  },

  Legal: {
    ListLegal: '/api/legal_basis/getAllLegalBasis',
    SaveLegal: '/api/admin/legal_basis/save',
    UpdateLegal: '/api/admin/legal_basis/update',
    DeleteLegal: '/api/admin/legal_basis/delete',
  },

  NewsTag: {
    list: '/api/admin/news_tag/index',
    create: '/api/admin/news_tag/create',
    update: '/api/admin/news_tag/update',
    delete: '/api/admin/news_tag/delete',
  },

  files: {
    upload: '/api/admin/file/upload',
    delete: '/api/admin/file/delete',
    addTag: '/api/admin/file/addTag',
    removeTag: '/api/admin/file/removeTag',
    download: '/api/admin/file/download',
    change: '/api/admin/file/change_name',
    getFavorit: '/api/admin/file/favorite',
    addFavorit: '/api/admin/file/addToFavorite',
    deleteFavorit: '/api/admin/file/deleteFavorite',
  },
  permission: {
    getPermissionFolder: '/api/admin/permission/folder/grantPermission',
    getPermissionFile: '/api/admin/permission/file/grantPermission',
  },
  tag: {
    create: '/api/admin/tag/create',
    index: '/api/admin/tag/index',
    delete: '/api/admin/tag/delete',
    update: '/api/admin/tag/update',
  },
  folder: {
    detail: '/api/admin/folder/info/',
    list: '/api/admin/folder', // folder list
    create: '/api/admin/folder/create', // create folder
    delete: '/api/admin/folder/delete', // delete folder
    edit: '/api/admin/folder/update', // edit folder
    addTag: '/api/admin/folder/addTag',
    removeTag: '/api/admin/folder/removeTag',
    getFavorit: '/api/admin/folder/favorite',
    addFavorit: '/api/admin/folder/addToFavorite',
    deleteFavorit: '/api/admin/folder/deleteFavorite',
  },
  users: {
    list: '/api/admin/users/list',
    create: '/api/admin/users/create_user',
    update: '/api/admin/users/update_user',
    delete: '/api/admin/users/delete_user',
    getTotalUser: '/api/admin/users/countTotalUser',
  },
  instance: {
    list: '/api/admin/instance/index',
    create: '/api/admin/instance/create',
    update: '/api/admin/instance/update',
    delete: '/api/admin/instance/delete',
  },
  AdminNews: {
    list: '/api/admin/news/getAllNews',
    detail: '/api/admin/news/getNewsDetail/',
    create: '/api/admin/news/create',
    Update: '/api/admin/news/update',
    UpdateStatus: '/api/admin/news/update/changeStatus',
    delete: '/api/admin/news/delete',
  },
};
