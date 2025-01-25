import Head from "next/head";
import { fetchVehicleById } from "@/services/vehicleService";
import Image from "next/image";

export default async function VehicleDetails({
  params,
}: {
  params: { id: string };
}) {
  const vehicle = await fetchVehicleById(params.id);

  return (
    <>
      <Head>
        <title>Vehicle Showcase | Home</title>
        <meta
          name="description"
          content="Browse our vehicle collection with ease."
        />
      </Head>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Images */}
        <div>
          <Image
            src={vehicle.images[0]}
            alt={`${vehicle.manufacturer} ${vehicle.model}`}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl font-bold">
            {vehicle.manufacturer} {vehicle.model}
          </h1>
          <p className="text-gray-500">{vehicle.year}</p>
          <p className="text-lg font-bold text-blue-600 mt-2">
            ${vehicle.price}
          </p>
          <p className="mt-4">{vehicle.description}</p>
        </div>
      </div>
    </>
  );
}
