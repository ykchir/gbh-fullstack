import { Injectable, Inject } from "@nestjs/common";
import { VehicleRepository } from "../../core/interfaces/vehicle.repository";

@Injectable()
export class GetVehiclesUseCase {
  constructor(
    @Inject("VehicleRepository")
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute() {
    return this.vehicleRepository.findAll();
  }
}
