import VehicleCard from "@/components/vehicles/VehicleCard";
import Pagination from "@/components/ui/Pagination";
import FiltersPanel from "@/components/ui/FiltersPanel";
import { GetVehiclesFilters } from "@/types/api/vehicles";
import { fetchHomeData } from "@/services/homeService";
import { handleClientError } from "@/utils/errorBoundary";
import ErrorPage from "@/components/ErrorPage";

export default async function Home({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<GetVehiclesFilters>;
}) {
  try {
    const searchParams = await searchParamsPromise;
    const { vehicles, total, vehicleFilters, filters } =
      await fetchHomeData(searchParams);

    const totalPages = Math.ceil(total / (filters.limit || 1));

    return (
      <div>
        <FiltersPanel
          manufacturers={vehicleFilters.manufacturers}
          types={vehicleFilters.types}
          years={vehicleFilters.years}
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
  } catch (error) {
    const { statusCode, message } = handleClientError(error);
    return <ErrorPage statusCode={statusCode} message={message} />;
  }
}
