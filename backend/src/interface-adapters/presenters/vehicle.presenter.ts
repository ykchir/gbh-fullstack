import { Vehicle as OriginalVehicle } from "shared-types";

interface Vehicle extends Omit<OriginalVehicle, "createdAt" | "updatedAt"> {
  createdAt?: Date;
  updatedAt?: Date;
}
import { GetVehiclesResponseDto } from "../../application/dtos/get-vehicles.response.dto";

export class VehiclePresenter {
  static toResponse(vehicle: Vehicle): GetVehiclesResponseDto {
    const rest = { ...vehicle };
    delete rest.createdAt;
    delete rest.updatedAt;
    return rest as GetVehiclesResponseDto;
  }

  static toResponseList(vehicles: Vehicle[]): GetVehiclesResponseDto[] {
    return vehicles.map((vehicle) => this.toResponse(vehicle));
  }
}
