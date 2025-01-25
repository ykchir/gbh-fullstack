import { fetchVehicles } from "@/services/vehicleService";
import Image from "next/image";

interface Vehicle {
  id: string;
  manufacturer: string;
  model: string;
  year: number;
  type: string;
  price: number;
  fuelType: string;
  transmission: string;
  mileage?: number;
  features: string[];
  images: string[];
  description: string;
}

export default async function Home() {
  const { vehicles } = await fetchVehicles();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle: Vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
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
      <p className="font-bold text-blue-600 mt-2">${vehicle.price}</p>
    </div>
  );
}
