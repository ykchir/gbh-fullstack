import { MOCK_VEHICLES } from "../../../fixtures/mock-vehicles";
import { Vehicle } from "../../../core/entities/vehicle.entity";
import { VehicleRepository } from "../../../core/interfaces/vehicle.repository";

export class MockVehicleRepository implements VehicleRepository {
  private vehicles: Vehicle[];

  constructor() {
    this.vehicles = MOCK_VEHICLES.map(
      (data) =>
        new Vehicle(
          data.id,
          data.manufacturer,
          data.model,
          data.year,
          data.type,
          data.price,
          data.fuelType,
          data.transmission,
          data.mileage,
          data.features,
          data.images,
          data.description,
        ),
    );
  }

  async findAll(): Promise<Vehicle[]> {
    return Promise.resolve(this.vehicles);
  }
}
