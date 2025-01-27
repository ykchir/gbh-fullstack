import { Vehicle } from "../../core/entities/vehicle.entity";

export function paginateVehicles(
  vehicles: Vehicle[],
  page: number = 1,
  limit: number = vehicles.length,
): { data: Vehicle[]; total: number } {
  const total = vehicles.length;

  const validPage = Math.max(1, page);
  const validLimit = Math.max(1, limit);

  const start = (validPage - 1) * validLimit;
  const end = start + validLimit;

  return {
    data: vehicles.slice(start, end),
    total,
  };
}
