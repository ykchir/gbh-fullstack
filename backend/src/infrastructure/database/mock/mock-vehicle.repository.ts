import { VehicleType } from "shared-types";
import { Vehicle } from "../../../core/entities/vehicle.entity";
import { VehicleRepository } from "../../../core/interfaces/vehicle.repository";
import { MOCK_VEHICLES } from "../../../fixtures/mock-vehicles";
import {
  NotFoundException,
  InternalServerException,
} from "../../../application/exceptions/custom-exceptions";

export class MockVehicleRepository implements VehicleRepository {
  private vehicles: Vehicle[];

  constructor() {
    try {
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
    } catch (error) {
      console.log(error);
      throw new InternalServerException(
        "Failed to initialize mock vehicle repository.",
      );
    }
  }

  async findAll(filters: {
    manufacturer?: string;
    type?: string;
    year?: number;
  }): Promise<{ data: Vehicle[]; total: number }> {
    try {
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
    } catch (error) {
      console.error(error);
      throw new InternalServerException("Failed to fetch vehicles.");
    }
  }

  async findById(id: string): Promise<Vehicle | null> {
    try {
      const vehicle = this.vehicles.find((vehicle) => vehicle.id === id);
      if (!vehicle) {
        throw new NotFoundException(`Vehicle with ID ${id} not found.`);
      }
      return Promise.resolve(vehicle);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerException("Failed to fetch vehicle by ID.");
    }
  }

  async getAllManufacturers(): Promise<string[]> {
    try {
      const manufacturers = MOCK_VEHICLES.map((v) => v.manufacturer);
      return Promise.resolve([...new Set(manufacturers)] as string[]);
    } catch (error) {
      console.log(error);
      throw new InternalServerException("Failed to fetch manufacturers.");
    }
  }

  async getAllYears(): Promise<number[]> {
    try {
      const years = MOCK_VEHICLES.map((v) => v.year);
      return Promise.resolve([...new Set(years)].sort((a, b) => b - a));
    } catch (error) {
      console.log(error);
      throw new InternalServerException("Failed to fetch years.");
    }
  }

  async getAllTypes(): Promise<VehicleType[]> {
    try {
      const types = MOCK_VEHICLES.map((v) => v.type);
      return Promise.resolve([...new Set(types)] as VehicleType[]);
    } catch (error) {
      console.log(error);
      throw new InternalServerException("Failed to fetch vehicle types.");
    }
  }
}
