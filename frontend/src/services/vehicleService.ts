import axios from "axios";
import { Vehicle } from "shared-types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export const fetchVehicles = async (): Promise<{ vehicles: Vehicle[] }> => {
  try {
    const response = await axios.get(`${API_URL}/vehicles`);

    return response.data;
  } catch (error) {
    console.error(error);
    return { vehicles: [] };
  }
};

export const fetchVehicleById = async (
  id: string,
): Promise<{ vehicles: Vehicle }> => {
  try {
    const response = await axios.get(`${API_URL}/vehicles/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
    return { vehicles: {} as Vehicle };
  }
};
