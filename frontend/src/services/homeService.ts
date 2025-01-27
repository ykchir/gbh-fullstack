import { fetchVehicles, fetchVehicleFilters } from "@/services/vehicleService";
import { GetVehiclesFilters } from "@/types/api/vehicles";

import { parseSearchParams } from "@/utils/filters";

export async function fetchHomeData(searchParams: GetVehiclesFilters) {
  const filters = parseSearchParams(searchParams);
  const [{ vehicles, total }, vehicleFilters] = await Promise.all([
    fetchVehicles(filters),
    fetchVehicleFilters(),
  ]);
  return { vehicles, total, vehicleFilters, filters };
}
