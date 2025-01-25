import { Vehicle } from "../../core/entities/vehicle.entity";

export type SortableFields = "price" | "year";

export function sortVehicles(
  vehicles: Vehicle[],
  sortBy: SortableFields,
  order: "asc" | "desc" = "asc",
): Vehicle[] {
  if (!sortBy) return vehicles;

  return vehicles.sort((a, b) => {
    const fieldA = a[sortBy as keyof Vehicle];
    const fieldB = b[sortBy as keyof Vehicle];

    if (fieldA === undefined || fieldB === undefined) {
      throw new Error(`Invalid sort field: ${sortBy}`);
    }

    return order === "asc" ? +fieldA - +fieldB : +fieldB - +fieldA;
  });
}
