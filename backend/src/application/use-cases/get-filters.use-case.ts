import { Inject, Injectable } from "@nestjs/common";
import { VehicleRepository } from "../../core/interfaces/vehicle.repository";
import { GetFiltersResponseDto } from "../dtos/get-filters.response.dto";
import {
  InternalServerException,
  ServiceUnavailableException,
} from "../exceptions/custom-exceptions";

@Injectable()
export class GetFiltersUseCase {
  constructor(
    @Inject("VehicleRepository")
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(): Promise<GetFiltersResponseDto> {
    try {
      const [manufacturers, years, types] = await Promise.all([
        this.vehicleRepository.getAllManufacturers(),
        this.vehicleRepository.getAllYears(),
        this.vehicleRepository.getAllTypes(),
      ]);

      return { manufacturers, years, types };
    } catch (error) {
      if (error instanceof ServiceUnavailableException) {
        throw error;
      }

      throw new InternalServerException("Failed to fetch filters.");
    }
  }
}
