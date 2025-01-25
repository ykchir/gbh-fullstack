import Link from "next/link";
import { Vehicle } from "shared-types";
import VehicleImage from "./VehicleImage";
import VehicleDetails from "./VehicleDetails";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link
      href={`/vehicles/${vehicle.id}`}
      className="block border rounded-lg p-4 shadow hover:shadow-lg transition group"
      aria-label={`View details for ${vehicle.manufacturer} ${vehicle.model}`}
    >
      <VehicleImage
        src={vehicle.images[0]}
        alt={`${vehicle.manufacturer} ${vehicle.model}`}
      />
      <VehicleDetails
        manufacturer={vehicle.manufacturer}
        model={vehicle.model}
        year={vehicle.year}
        price={vehicle.price}
      />
    </Link>
  );
}
