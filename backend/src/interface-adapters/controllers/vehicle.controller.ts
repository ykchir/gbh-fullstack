import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { GetVehiclesUseCase } from "../../application/use-cases/get-vehicles.use-case";
import { GetVehicleDetailsUseCase } from "../../application/use-cases/get-vehicle-details.use-case";
import { VehiclePresenter } from "../presenters/vehicle.presenter";
import { GetVehiclesDto } from "../../application/dtos/get-vehicles.dto";
import { GetFiltersResponseDto } from "../../application/dtos/get-filters.response.dto";
import { GetFiltersUseCase } from "../../application/use-cases/get-filters.use-case";

@Controller("api/vehicles")
export class VehicleController {
  constructor(
    private readonly getVehiclesUseCase: GetVehiclesUseCase,
    private readonly getVehicleDetailsUseCase: GetVehicleDetailsUseCase,
    private readonly getFiltersUseCase: GetFiltersUseCase,
  ) {}

  @Get()
  async getVehicles(@Query() filters: GetVehiclesDto) {
    try {
      const vehicles = await this.getVehiclesUseCase.execute(filters);

      return VehiclePresenter.toResponseListWithPagination(vehicles);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        "An error occurred while fetching vehicles.",
      );
    }
  }

  @Get("filters")
  async getFilters(): Promise<GetFiltersResponseDto> {
    try {
      const filters = await this.getFiltersUseCase.execute();

      return filters;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        "An error occurred while fetching filters.",
      );
    }
  }

  @Get(":id")
  async getVehicleDetails(@Param("id") id: string) {
    if (!id) {
      throw new BadRequestException("Vehicle ID is required.");
    }

    try {
      const vehicle = await this.getVehicleDetailsUseCase.execute(id);

      if (!vehicle) {
        throw new NotFoundException(`Vehicle with ID ${id} not found.`);
      }

      return VehiclePresenter.toResponse(vehicle);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        "An error occurred while fetching vehicle details.",
      );
    }
  }
}
