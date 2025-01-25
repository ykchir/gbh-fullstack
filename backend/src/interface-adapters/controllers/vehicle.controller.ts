import { Controller, Get, Param, Query } from "@nestjs/common";
import { GetVehiclesUseCase } from "../../application/use-cases/get-vehicles.use-case";
import { GetVehicleDetailsUseCase } from "../../application/use-cases/get-vehicle-details.use-case";
import { VehiclePresenter } from "../presenters/vehicle.presenter";
import { GetVehiclesDto } from "../../application/dtos/get-vehicles.dto";

@Controller("api/vehicles")
export class VehicleController {
  constructor(
    private readonly getVehiclesUseCase: GetVehiclesUseCase,
    private readonly getVehicleDetailsUseCase: GetVehicleDetailsUseCase,
  ) {}

  @Get()
  async getVehicles(@Query() filters: GetVehiclesDto) {
    const vehicles = await this.getVehiclesUseCase.execute(filters);

    return VehiclePresenter.toResponseListWithPagination(vehicles);
  }

  @Get(":id")
  async getVehicleDetails(@Param("id") id: string) {
    const vehicle = await this.getVehicleDetailsUseCase.execute(id);
    return VehiclePresenter.toResponse(vehicle);
  }
}
