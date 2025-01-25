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

  static toResponseListWithPagination(data: {
    data: Vehicle[];
    total: number;
  }) {
    return {
      vehicles: data.data.map((vehicle) => ({
        id: vehicle.id,
        manufacturer: vehicle.manufacturer,
        model: vehicle.model,
        year: vehicle.year,
        type: vehicle.type,
        price: vehicle.price,
        fuelType: vehicle.fuelType,
        transmission: vehicle.transmission,
        mileage: vehicle.mileage,
        features: vehicle.features,
        images: vehicle.images,
        description: vehicle.description,
      })),
      total: data.total,
    };
  }
}
