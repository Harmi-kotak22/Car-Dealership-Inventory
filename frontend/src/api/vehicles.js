import api from './axios';
import { endpoints } from './endpoints';

export const getVehicles = async () => {
  const response = await api.get(endpoints.vehicles.list);
  return response.data;
};

export const searchVehicles = async (params) => {
  const response = await api.get(endpoints.vehicles.search, { params });
  return response.data;
};

export const purchaseVehicle = async (vehicleId) => {
  const response = await api.post(endpoints.vehicles.purchase(vehicleId));
  return response.data;
};
