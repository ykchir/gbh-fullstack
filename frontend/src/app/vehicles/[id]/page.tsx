import { fetchVehicleById } from "@/services/vehicleService";
import VehicleImage from "@/components/vehicles/VehicleImage";
import VehicleInfo from "@/components/vehicles/VehicleInfo";

export default async function VehicleDetails({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await Promise.resolve(params);
  const vehicle = await fetchVehicleById(id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <VehicleImage
        src={vehicle.images[0]}
        alt={`${vehicle.manufacturer} ${vehicle.model}`}
      />

      <VehicleInfo
        manufacturer={vehicle.manufacturer}
        model={vehicle.model}
        year={vehicle.year}
        price={vehicle.price}
        description={vehicle.description}
      />
    </div>
  );
}
