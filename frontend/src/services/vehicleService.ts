import { GetVehiclesFilters, VehiclesFilters } from "@/types/api/vehicles";
import axios from "axios";
import { Vehicle } from "shared-types";
import { AppError, handleError } from "@/utils/errorHandler";

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
    const { message, statusCode } = handleError(error);
    throw new AppError(`Unable to fetch vehicles: ${message}`, statusCode);
  }
}

export const fetchVehicleById = async (id: string): Promise<Vehicle> => {
  try {
    const response = await axios.get(`${API_URL}/vehicles/${id}`);
    return response.data;
  } catch (error) {
    const { message, statusCode } = handleError(error);
    throw new AppError(`Unable to fetch vehicle by id: ${message}`, statusCode);
  }
};

export const fetchVehicleFilters = async (): Promise<VehiclesFilters> => {
  try {
    const response = await axios.get(`${API_URL}/vehicles/filters`);
    return response.data;
  } catch (error) {
    const { message, statusCode } = handleError(error);
    throw new AppError(
      `Unable to fetch vehicle filters: ${message}`,
      statusCode,
    );
  }
};
