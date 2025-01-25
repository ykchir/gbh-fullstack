import { Controller, Get, Query } from "@nestjs/common";
import { GetVehiclesUseCase } from "../../application/use-cases/get-vehicles.use-case";
import { VehiclePresenter } from "../presenters/vehicle.presenter";
import { GetVehiclesDto } from "../../application/dtos/get-vehicles.dto";

@Controller("api/vehicles")
export class VehicleController {
  constructor(private readonly getVehiclesUseCase: GetVehiclesUseCase) {}

  @Get()
  async getVehicles(@Query() filters: GetVehiclesDto) {
    const vehicles = await this.getVehiclesUseCase.execute(filters);

    return VehiclePresenter.toResponseListWithPagination(vehicles);
  }
}
