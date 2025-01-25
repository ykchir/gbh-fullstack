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

  async findAll(filters: {
    manufacturer?: string;
    type?: string;
    year?: number;
  }): Promise<Vehicle[]> {
    let filteredVehicles = this.vehicles;

    if (filters?.manufacturer) {
      const normalizedManufacturer = filters.manufacturer.toLowerCase();
      filteredVehicles = filteredVehicles.filter(
        (v) => v.manufacturer.toLowerCase() === normalizedManufacturer,
      );
    }

    if (filters?.type) {
      const normalizedType = filters.type.toLowerCase();
      filteredVehicles = filteredVehicles.filter(
        (v) => v.type.toLowerCase() === normalizedType,
      );
    }

    if (filters?.year) {
      filteredVehicles = filteredVehicles.filter(
        (v) => v.year === filters.year,
      );
    }

    return Promise.resolve(filteredVehicles);
  }
}
