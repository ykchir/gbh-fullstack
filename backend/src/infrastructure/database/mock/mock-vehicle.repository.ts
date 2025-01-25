import { Vehicle } from "../../../core/entities/vehicle.entity";
import { VehicleRepository } from "../../../core/interfaces/vehicle.repository";
import { MOCK_VEHICLES } from "../../../fixtures/mock-vehicles";

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
  }): Promise<{ data: Vehicle[]; total: number }> {
    let filteredVehicles = [...this.vehicles];

    if (filters.manufacturer) {
      filteredVehicles = filteredVehicles.filter((v) =>
        v.manufacturer
          .toLowerCase()
          .includes(filters.manufacturer!.toLowerCase()),
      );
    }

    if (filters.type) {
      filteredVehicles = filteredVehicles.filter((v) =>
        v.type.toLowerCase().includes(filters.type!.toLowerCase()),
      );
    }

    if (filters.year) {
      filteredVehicles = filteredVehicles.filter(
        (v) => v.year === filters.year,
      );
    }

    return Promise.resolve({
      data: filteredVehicles,
      total: filteredVehicles.length,
    });
  }
}
