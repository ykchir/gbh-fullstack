import { GetVehiclesFilters, VehiclesFilters } from "@/types/api/vehicles";
import axios from "axios";
import { Vehicle } from "shared-types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export async function fetchVehicles(filters: GetVehiclesFilters) {
  try {
    const { data } = await axios.get<{ vehicles: Vehicle[]; total: number }>(
      `${API_URL}/vehicles`,
      {
        params: filters,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );

    return data;
  } catch (error) {
    throw new Error(`Unable to fetch vehicles. Error: ${error}`);
  }
}

export const fetchVehicleById = async (id: string): Promise<Vehicle> => {
  try {
    const response = await axios.get(`${API_URL}/vehicles/${id}`);

    return response.data;
  } catch (error) {
    throw new Error(`Unable to fetch vehicle by id. Error: ${error}`);
    return {} as Vehicle;
  }
};

export const fetchVehicleFilters = async (): Promise<VehiclesFilters> => {
  try {
    const response = await axios.get(`${API_URL}/vehicles/filters`);

    return response.data;
  } catch (error) {
    throw new Error(`Unable to fetch vehicle filter. Error: ${error}`);
    return {} as VehiclesFilters;
  }
};
