import { formatCurrency } from "@/utils/formatters";

export default function VehicleDetails({
  manufacturer,
  model,
  year,
  price,
}: {
  manufacturer: string;
  model: string;
  year: number;
  price: number;
}) {
  const formattedPrice = formatCurrency(price);

  return (
    <>
      <h3 className="text-lg font-semibold group-hover:text-blue-600">
        {manufacturer} {model}
      </h3>
      <p className="text-gray-500">{year}</p>
      <p className="font-bold text-blue-600 mt-2">{formattedPrice}</p>
    </>
  );
}
