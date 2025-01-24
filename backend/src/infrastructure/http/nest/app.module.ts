import { Module } from "@nestjs/common";
import { VehicleController } from "../../../interface-adapters/controllers/vehicle.controller";
import { GetVehiclesUseCase } from "../../../application/use-cases/get-vehicles.use-case";
import { MockVehicleRepository } from "../../../infrastructure/database/mock/mock-vehicle.repository";

@Module({
  controllers: [VehicleController],
  providers: [
    GetVehiclesUseCase,
    {
      provide: "VehicleRepository",
      useClass: MockVehicleRepository,
    },
  ],
})
export class AppModule {}
