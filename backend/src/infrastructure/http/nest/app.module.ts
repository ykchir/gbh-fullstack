import { Module } from "@nestjs/common";
import { VehicleController } from "../../../interface-adapters/controllers/vehicle.controller";
import { GetVehiclesUseCase } from "../../../application/use-cases/get-vehicles.use-case";
import { GetVehicleDetailsUseCase } from "../../../application/use-cases/get-vehicle-details.use-case";
import { MockVehicleRepository } from "../../../infrastructure/database/mock/mock-vehicle.repository";
import { GetFiltersUseCase } from "../../../application/use-cases/get-filters.use-case";

@Module({
  controllers: [VehicleController],
  providers: [
    GetVehiclesUseCase,
    GetVehicleDetailsUseCase,
    GetFiltersUseCase,
    {
      provide: "VehicleRepository",
      useClass: MockVehicleRepository,
    },
  ],
  exports: [GetVehiclesUseCase],
})
export class AppModule {}
