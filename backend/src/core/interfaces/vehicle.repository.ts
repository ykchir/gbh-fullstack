import { Vehicle } from "../entities/vehicle.entity";

export interface VehicleRepository {
  findAll(filters: {
    manufacturer?: string;
    type?: string;
    year?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: Vehicle[]; total: number }>;
}
