import { Inject, Injectable } from "@nestjs/common";
import { VehicleRepository } from "../../core/interfaces/vehicle.repository";
import { Vehicle } from "../../core/entities/vehicle.entity";

@Injectable()
export class GetVehicleDetailsUseCase {
  constructor(
    @Inject("VehicleRepository")
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);

    if (!vehicle) {
      throw new Error(`Vehicle with ID ${id} not found.`);
    }

    return vehicle;
  }
}
