// src/api/axios.js
import axios from 'axios';

// ===================================================================
// INSTANCE AXIOS PRINCIPALE
// ===================================================================

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;