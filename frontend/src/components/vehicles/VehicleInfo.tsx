import { formatCurrency } from "@/utils/formatters";

export default function VehicleInfo({
  manufacturer,
  model,
  year,
  price,
  description,
}: {
  manufacturer: string;
  model: string;
  year: number;
  price: number;
  description: string;
}) {
  const formattedPrice = formatCurrency(price);

  return (
    <div>
      <h1 className="text-2xl font-bold">
        {manufacturer} {model}
      </h1>
      <p className="text-gray-500">{year}</p>
      <p className="text-lg font-bold text-blue-600 mt-2">{formattedPrice}</p>
      <p className="mt-4">{description}</p>
    </div>
  );
}
