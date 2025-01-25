import { Inject, Injectable } from "@nestjs/common";
import { VehicleRepository } from "../../core/interfaces/vehicle.repository";
import { Vehicle } from "../../core/entities/vehicle.entity";
import { SortableFields, sortVehicles } from "../utils/sort-vehicles.util";
import { paginateVehicles } from "../utils/paginate-vehicles.util";
import {
  BadRequestException,
  InternalServerException,
} from "../exceptions/custom-exceptions";

@Injectable()
export class GetVehiclesUseCase {
  constructor(
    @Inject("VehicleRepository")
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(
    filters: {
      manufacturer?: string;
      type?: string;
      year?: number;
      page?: number;
      limit?: number;
      sortBy?: SortableFields;
      order?: "asc" | "desc";
    } = {},
  ): Promise<{ data: Vehicle[]; total: number }> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy,
        order = "asc",
        ...filterCriteria
      } = filters;

      if (page < 1 || limit < 1) {
        throw new BadRequestException(
          "Page and limit must be greater than 0",
          "INVALID_PAGINATION",
        );
      }

      const result = await this.vehicleRepository.findAll(filterCriteria);

      if (!result || !Array.isArray(result.data)) {
        throw new InternalServerException(
          "Invalid data returned from VehicleRepository",
        );
      }

      let vehicles = result.data;

      if (sortBy) {
        vehicles = sortVehicles(vehicles, sortBy, order);
      }

      const paginatedResult = paginateVehicles(vehicles, page, limit);

      return {
        data: paginatedResult.data,
        total: result.total,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerException
      ) {
        throw error;
      }

      throw new InternalServerException(
        "An unexpected error occurred",
        "UNEXPECTED_ERROR",
      );
    }
  }
}
