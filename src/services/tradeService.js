import axios from 'axios';
import { parseCSV } from '../utils/csvParser';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const uploadTrades = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_URL}/trades/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getAllTrades = async () => {
  const response = await axios.get(`${API_URL}/trades`);
  return response.data;
};

export const getTrade = async (id) => {
  const response = await axios.get(`${API_URL}/trades/${id}`);
  return response.data;
};

export const createTrade = async (trade) => {
  const response = await axios.post(`${API_URL}/trades`, trade);
  return response.data;
};

export const updateTrade = async (id, trade) => {
  const response = await axios.put(`${API_URL}/trades/${id}`, trade);
  return response.data;
};

export const deleteTrade = async (id) => {
  const response = await axios.delete(`${API_URL}/trades/${id}`);
  return response.data;
}; 