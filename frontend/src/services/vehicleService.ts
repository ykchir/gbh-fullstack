import axios from "axios";
import { Vehicle } from "shared-types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export const fetchVehicles = async (
  page = 1,
  limit = 6,
): Promise<{ vehicles: Vehicle[]; total: number }> => {
  try {
    const response = await axios.get(
      `${API_URL}/vehicles?page=${page}&limit=${limit}`,
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return { vehicles: [], total: 0 };
  }
};

export const fetchVehicleById = async (id: string): Promise<Vehicle> => {
  try {
    const response = await axios.get(`${API_URL}/vehicles/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
    return {} as Vehicle;
  }
};
