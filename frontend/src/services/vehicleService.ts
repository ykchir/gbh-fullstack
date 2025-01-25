import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export const fetchVehicles = async () => {
  const response = await axios.get(`${API_URL}/vehicles`);
  return response.data;
};

export const fetchVehicleById = async (id: string) => {
  const response = await axios.get(`${API_URL}/vehicles/${id}`);
  return response.data;
};
