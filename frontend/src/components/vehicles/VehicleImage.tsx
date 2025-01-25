import Image from "next/image";
export default function VehicleImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div className="relative w-full h-48 mb-4">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          className="rounded-md"
        />
      ) : (
        <div className="bg-gray-200 w-full h-full rounded-md flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}
    </div>
  );
}
