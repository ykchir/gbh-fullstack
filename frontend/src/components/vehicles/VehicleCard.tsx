import Image from "next/image";
import { Vehicle } from "shared-types";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(vehicle.price);

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <div className="relative w-full h-48 mb-4">
        <Image
          src={vehicle.images[0]}
          alt={`${vehicle.manufacturer} ${vehicle.model}`}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <h3 className="text-lg font-semibold">
        {vehicle.manufacturer} {vehicle.model}
      </h3>
      <p className="text-gray-500">{vehicle.year}</p>
      <p className="font-bold text-blue-600 mt-2">{formattedPrice}</p>
    </div>
  );
}
