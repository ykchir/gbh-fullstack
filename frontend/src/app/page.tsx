import VehicleCard from "@/components/vehicles/VehicleCard";
import { fetchVehicles } from "@/services/vehicleService";
import { Vehicle } from "shared-types";
import Pagination from "@/components/ui/Pagination";
import FiltersPanel from "@/components/ui/FiltersPanel";
import { GetVehiclesFilters } from "@/types/api/vehicles";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<GetVehiclesFilters>;
}) {
  const resolvedSearchParams = await searchParams;

  const filters: GetVehiclesFilters = {
    manufacturer: resolvedSearchParams.manufacturer || undefined,
    type: resolvedSearchParams.type || undefined,
    year: resolvedSearchParams.year
      ? parseInt(resolvedSearchParams.year.toString(), 10)
      : undefined,
    page: resolvedSearchParams.page
      ? parseInt(resolvedSearchParams.page.toString(), 10)
      : 1,
    limit: 6,
    sortBy: resolvedSearchParams.sortBy || undefined,
    order: resolvedSearchParams.order || undefined,
  };

  const { vehicles, total }: { vehicles: Vehicle[]; total: number } =
    await fetchVehicles(filters);

  const totalPages = Math.ceil(total / (filters.limit || 1));

  return (
    <div>
      <FiltersPanel
        manufacturers={["Toyota", "Honda", "Tesla"]}
        types={["SUV", "Sedan", "Truck"]}
        years={[2023, 2022, 2021]}
        currentFilters={filters}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      <Pagination currentPage={filters.page || 1} totalPages={totalPages} />
    </div>
  );
}
