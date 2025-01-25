import { Controller, Get, Query } from "@nestjs/common";
import { GetVehiclesUseCase } from "../../application/use-cases/get-vehicles.use-case";
import { VehiclePresenter } from "../presenters/vehicle.presenter";

@Controller("/api/vehicles")
export class VehicleController {
  constructor(private readonly getVehiclesUseCase: GetVehiclesUseCase) {}

  @Get()
  async getVehicles(
    @Query("manufacturer") manufacturer?: string,
    @Query("type") type?: string,
    @Query("year") year?: number,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ) {
    const filters = {
      manufacturer,
      type,
      year: year ? Number(year) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    };

    const vehicles = await this.getVehiclesUseCase.execute(filters);

    return VehiclePresenter.toResponseListWithPagination(vehicles);
  }
}
