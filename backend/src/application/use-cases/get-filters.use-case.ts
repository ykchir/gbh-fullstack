import { Inject, Injectable } from "@nestjs/common";
import { VehicleRepository } from "../../core/interfaces/vehicle.repository";
import { GetFiltersResponseDto } from "../dtos/get-filters.response.dto";

@Injectable()
export class GetFiltersUseCase {
  constructor(
    @Inject("VehicleRepository")
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(): Promise<GetFiltersResponseDto> {
    const manufacturers = await this.vehicleRepository.getAllManufacturers();
    const years = await this.vehicleRepository.getAllYears();
    const types = await this.vehicleRepository.getAllTypes();

    return { manufacturers, years, types };
  }
}
