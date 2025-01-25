import VehicleCard from "@/components/vehicles/VehicleCard";
import Pagination from "@/components/ui/Pagination";
import { fetchVehicles } from "@/services/vehicleService";
import { Vehicle } from "shared-types";

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string } | Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams?.page || "1", 10);

  const limit = 6;

  const { vehicles, total }: { vehicles: Vehicle[]; total: number } =
    await fetchVehicles(page, limit);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
