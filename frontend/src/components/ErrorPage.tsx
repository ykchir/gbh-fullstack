import Link from "next/link";

interface ErrorPageProps {
  statusCode: number;
  message: string;
}

export default function ErrorPage({ statusCode, message }: ErrorPageProps) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-500">Error {statusCode}</h1>
        <p className="text-gray-700 mt-2">{message}</p>
        <Link href="/" className="text-blue-500 underline mt-4 block">
          Go back to Home
        </Link>
      </div>
    </div>
  );
}
