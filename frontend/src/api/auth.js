import api from './axios';
import { endpoints } from './endpoints';

export const registerUser = async (payload) => {
  const response = await api.post(endpoints.auth.register, payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await api.post(endpoints.auth.login, payload);
  return response.data;
};
