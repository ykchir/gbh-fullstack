import { GetVehiclesFilters } from "@/types/api/vehicles";

export function parseSearchParams(
  searchParams: GetVehiclesFilters,
): GetVehiclesFilters {
  return {
    manufacturer: searchParams.manufacturer || undefined,
    type: searchParams.type || undefined,
    year: searchParams.year
      ? parseInt(searchParams.year.toString(), 10)
      : undefined,
    page: searchParams.page ? parseInt(searchParams.page.toString(), 10) : 1,
    limit: 6,
    sortBy: searchParams.sortBy || undefined,
    order: searchParams.order || undefined,
  };
}
