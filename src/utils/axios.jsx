import axios from 'axios';
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

// Function to set the token
export const setToken = (token) => {
  if (token) {
    sessionStorage.setItem('accessToken', token);
  } else {
    sessionStorage.removeItem('accessToken');
  }
};

// Request interceptor to attach the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken'); // Get token from sessionStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach Bearer token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    // Check for response status
    if (error.response) {
      if (error.response.status === 403) {
        // Redirect to the 403 page
        window.location = '/403'; // Adjust the path as needed
      } else if (error.response.status === 500) {
        // Redirect to the 500 page
        window.location = '/500'; // Adjust the path as needed
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
    // register: '/api/auth/register/',
  },

  // previewImage: {
  //   preview: (hashedId) => `/api/file/preview/${hashedId}`,
  // },

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
  previewImage: {
    preview: '/api/file/preview/',
  },
  GetFileFolderShare: {
    UserShare: '/api/getSharedFolderAndFile',
    GetShareFolderFile: '/api/getSharedFolderAndFile',
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
  },
  //admin
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
  },
  users: {
    list: '/api/admin/users/list',
    create: '/api/admin/users/create_user',
    update: '/api/admin/users/update_user',
    delete: '/api/admin/users/delete_user',
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
