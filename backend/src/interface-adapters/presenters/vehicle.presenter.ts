import { Vehicle as OriginalVehicle } from "shared-types";
import { GetVehiclesResponseDto } from "../../application/dtos/get-vehicles.response.dto";

interface Vehicle extends Omit<OriginalVehicle, "createdAt" | "updatedAt"> {
  createdAt?: Date;
  updatedAt?: Date;
}

export class VehiclePresenter {
  static toResponse(vehicle: Vehicle): GetVehiclesResponseDto {
    const rest = { ...vehicle };
    delete rest.createdAt;
    delete rest.updatedAt;
    return rest as GetVehiclesResponseDto;
  }

  static toResponseListWithPagination(data: {
    data: Vehicle[];
    total: number;
  }) {
    return {
      vehicles: data.data.map((vehicle) => this.toResponse(vehicle)),
      total: data.total,
    };
  }
}
