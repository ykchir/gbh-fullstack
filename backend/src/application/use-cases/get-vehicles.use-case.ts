import { Vehicle } from "../../core/entities/vehicle.entity";
import { VehicleRepository } from "../../core/interfaces/vehicle.repository";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetVehiclesUseCase {
  constructor(
    @Inject("VehicleRepository")
    private readonly repository: VehicleRepository,
  ) {}

  async execute(
    filters: {
      manufacturer?: string;
      type?: string;
      year?: number;
    } = {},
  ): Promise<Vehicle[]> {
    return this.repository.findAll(filters);
  }
}
