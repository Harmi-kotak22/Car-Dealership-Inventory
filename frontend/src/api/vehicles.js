import api from './axios';
import { endpoints } from './endpoints';

export const getVehicles = async () => {
  const response = await api.get(endpoints.vehicles.list);
  return response.data;
};

export const getVehicleById = async (vehicleId) => {
  const response = await api.get(endpoints.vehicles.update(vehicleId));
  return response.data;
};

export const searchVehicles = async (params) => {
  const response = await api.get(endpoints.vehicles.search, { params });
  return response.data;
};

export const createVehicle = async (payload) => {
  const response = await api.post(endpoints.vehicles.create, payload);
  return response.data;
};

export const updateVehicle = async (vehicleId, payload) => {
  const response = await api.put(endpoints.vehicles.update(vehicleId), payload);
  return response.data;
};

export const deleteVehicle = async (vehicleId) => {
  const response = await api.delete(endpoints.vehicles.delete(vehicleId));
  return response.data;
};

export const restockVehicle = async (vehicleId, quantity) => {
  const response = await api.post(endpoints.vehicles.restock(vehicleId), { quantity });
  return response.data;
};

export const purchaseVehicle = async (vehicleId) => {
  const response = await api.post(endpoints.vehicles.purchase(vehicleId));
  return response.data;
};
