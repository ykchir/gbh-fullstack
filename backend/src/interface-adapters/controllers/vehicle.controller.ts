import { Controller, Get } from "@nestjs/common";
import { GetVehiclesUseCase } from "../../application/use-cases/get-vehicles.use-case";
import { VehiclePresenter } from "../presenters/vehicle.presenter";

@Controller("vehicles")
export class VehicleController {
  constructor(private readonly getVehiclesUseCase: GetVehiclesUseCase) {}

  @Get()
  async getVehicles() {
    const vehicles = await this.getVehiclesUseCase.execute();
    return VehiclePresenter.toResponseList(vehicles);
  }
}
