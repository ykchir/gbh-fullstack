import { Vehicle } from "shared-types";

export type GetVehiclesResponseDto = Omit<Vehicle, "createdAt" | "updatedAt">;
