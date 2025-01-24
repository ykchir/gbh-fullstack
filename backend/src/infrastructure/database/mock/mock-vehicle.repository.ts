import { Injectable } from "@nestjs/common";
import { Vehicle } from "../../../core/entities/vehicle.entity";
import { VehicleRepository } from "../../../core/interfaces/vehicle.repository";

@Injectable()
export class MockVehicleRepository implements VehicleRepository {
  private vehicles: Vehicle[] = [
    new Vehicle("1", "Tesla", "Model S", 2022, 89999),
    new Vehicle("2", "BMW", "X5", 2021, 75000),
    new Vehicle("3", "Toyota", "Camry", 2020, 30000),
  ];

  findAll(): Promise<Vehicle[]> {
    return Promise.resolve(this.vehicles);
  }
}
