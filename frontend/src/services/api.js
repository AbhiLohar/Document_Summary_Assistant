import axios from 'axios';

const formatApiUrl = () => {
  let url = import.meta.env.VITE_API_URL || '/api';
  url = url.trim().replace(/\/+$/, ''); // Remove trailing slashes
  if (url && url !== '/api' && !url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

const API_BASE_URL = formatApiUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes timeout for large document summarization
});

export const getStoredApiKey = () => {
  return localStorage.getItem('gemini_api_key') || '';
};

export const setStoredApiKey = (key) => {
  if (key && key.trim()) {
    localStorage.setItem('gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('gemini_api_key');
  }
};

export const checkHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export const validateApiKey = async (apiKey) => {
  const response = await apiClient.get('/validate-key', {
    params: { api_key: apiKey },
  });
  return response.data;
};

export const uploadAndExtract = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  // Include API key so backend can use Gemini Vision OCR if Tesseract is unavailable
  const apiKey = getStoredApiKey();
  if (apiKey) {
    formData.append('api_key', apiKey);
  }

  const response = await apiClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percent);
      }
    },
  });

  return response.data;
};

export const summarizeDocument = async ({ text, summaryLength = 'medium', metadata = null, apiKey = null }) => {
  const effectiveKey = apiKey || getStoredApiKey() || null;
  const payload = {
    text,
    summary_length: summaryLength,
    api_key: effectiveKey,
    metadata,
  };

  const response = await apiClient.post('/summarize', payload);
  return response.data;
};

export const processDocumentEndToEnd = async ({ file, summaryLength = 'medium', apiKey = null, onUploadProgress }) => {
  const effectiveKey = apiKey || getStoredApiKey() || null;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('summary_length', summaryLength);
  if (effectiveKey) {
    formData.append('api_key', effectiveKey);
  }

  const response = await apiClient.post('/process', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percent);
      }
    },
  });

  return response.data;
};
