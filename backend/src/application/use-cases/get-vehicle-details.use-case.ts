import { Inject, Injectable } from "@nestjs/common";
import { VehicleRepository } from "../../core/interfaces/vehicle.repository";
import { Vehicle } from "../../core/entities/vehicle.entity";
import { NotFoundException } from "../../application/exceptions/custom-exceptions";

@Injectable()
export class GetVehicleDetailsUseCase {
  constructor(
    @Inject("VehicleRepository")
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(id: string): Promise<Vehicle> {
    try {
      const vehicle = await this.vehicleRepository.findById(id);

      if (!vehicle) {
        throw new NotFoundException(
          `Vehicle with ID ${id} not found.`,
          "VEHICLE_NOT_FOUND",
        );
      }

      return vehicle;
    } catch (error) {
      throw error;
    }
  }
}
