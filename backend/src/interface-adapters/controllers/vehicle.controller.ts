import { Controller, Get } from "@nestjs/common";
import { GetVehiclesUseCase } from "../../application/use-cases/get-vehicles.use-case";

@Controller("vehicles")
export class VehicleController {
  constructor(private readonly getVehiclesUseCase: GetVehiclesUseCase) {}

  @Get()
  async getVehicles() {
    return this.getVehiclesUseCase.execute();
  }
}
