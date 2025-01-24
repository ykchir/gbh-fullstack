import { Vehicle } from "../entities/vehicle.entity";

export interface VehicleRepository {
  findAll(): Promise<Vehicle[]>;
}
