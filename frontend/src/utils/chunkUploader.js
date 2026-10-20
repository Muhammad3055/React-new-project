import { getApiUrl } from './apiCache';
import {
  uploadFileInChunks as upload,
  postMediaForm as post,
} from '../../../backend/static/js/upload-client.js';

export const uploadFileInChunks = (file, onProgress) => upload(file, onProgress, getApiUrl);
export const postMediaForm = (url, formData, onProgress) => post(getApiUrl(url), formData, onProgress, getApiUrl);
