import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { VehicleController } from "../../../interface-adapters/controllers/vehicle.controller";
import { GetVehiclesUseCase } from "../../../application/use-cases/get-vehicles.use-case";
import { GetVehicleDetailsUseCase } from "../../../application/use-cases/get-vehicle-details.use-case";
import { MockVehicleRepository } from "../../../infrastructure/database/mock/mock-vehicle.repository";
import { GetFiltersUseCase } from "../../../application/use-cases/get-filters.use-case";
import { GlobalExceptionFilter } from "../filters/global-exception.filter";

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
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  exports: [GetVehiclesUseCase],
})
export class AppModule {}
