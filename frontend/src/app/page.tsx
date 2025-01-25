import VehicleCard from "@/components/vehicles/VehicleCard";
import { fetchVehicles } from "@/services/vehicleService";
import { Vehicle } from "shared-types";

export default async function Home() {
  const { vehicles }: { vehicles: Vehicle[] } = await fetchVehicles();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}
