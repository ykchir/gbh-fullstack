import { VehicleType } from "shared-types";
import { Vehicle } from "../entities/vehicle.entity";

export interface VehicleRepository {
  findAll(filters: {
    manufacturer?: string;
    type?: string;
    year?: number;
    page?: number;
    limit?: number;
    sortBy?: "price" | "year";
    order?: "asc" | "desc";
  }): Promise<{ data: Vehicle[]; total: number }>;
  findById(id: string): Promise<Vehicle | null>;
  getAllManufacturers(): Promise<string[]>;
  getAllYears(): Promise<number[]>;
  getAllTypes(): Promise<VehicleType[]>;
}
