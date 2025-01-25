"use client";

import { GetVehiclesFilters } from "@/types/api/vehicles";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FilterSelect from "./FilterSelect";

interface FiltersPanelProps {
  manufacturers: string[];
  types: string[];
  years: number[];
  currentFilters: GetVehiclesFilters;
}

export default function FiltersPanel({
  manufacturers,
  types,
  years,
  currentFilters,
}: FiltersPanelProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<GetVehiclesFilters>(currentFilters);
  const [isVisible, setIsVisible] = useState(false);

  const handleChange = <T extends keyof GetVehiclesFilters>(
    key: T,
    value: GetVehiclesFilters[T],
  ) => {
    const updatedFilters = { ...filters, [key]: value || undefined, page: 1 };
    setFilters(updatedFilters);

    const queryParams = new URLSearchParams(
      Object.entries(updatedFilters)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)]),
    );
    router.push(`/?${queryParams.toString()}`);
  };

  const handleReset = () => {
    setFilters({ page: 1, limit: 6 });
    router.push("/");
  };

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const isResetDisabled = !Object.values(filters).some((v) => v !== undefined);

  return (
    <div>
      {/* Toggle Filters Button */}
      <div className="mb-4">
        <button
          onClick={toggleVisibility}
          className="text-blue-500 hover:underline"
        >
          {isVisible ? "- Hide Filters" : "+ Show Filters"}
        </button>
      </div>

      {/* Filters Section */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          isVisible
            ? "opacity-100 max-h-screen"
            : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col gap-4 p-4 border rounded">
          <FilterSelect
            label="Manufacturer"
            options={manufacturers.map((m) => ({ label: m, value: m }))}
            value={filters.manufacturer || ""}
            onChange={(value) => handleChange("manufacturer", value as string)}
          />

          <FilterSelect
            label="Type"
            options={types.map((t) => ({ label: t, value: t }))}
            value={filters.type || ""}
            onChange={(value) => handleChange("type", value as string)}
          />

          <FilterSelect
            label="Year"
            options={years.map((y) => ({ label: y.toString(), value: y }))}
            value={filters.year || ""}
            onChange={(value) => handleChange("year", Number(value))}
          />

          <FilterSelect
            label="Sort By"
            options={[
              { label: "Price", value: "price" },
              { label: "Year", value: "year" },
            ]}
            value={filters.sortBy || ""}
            onChange={(value) =>
              handleChange("sortBy", value as "price" | "year")
            }
          />

          <FilterSelect
            label="Order"
            options={[
              { label: "Ascending", value: "asc" },
              { label: "Descending", value: "desc" },
            ]}
            value={filters.order || ""}
            onChange={(value) => handleChange("order", value as "asc" | "desc")}
            disabled={!filters.sortBy}
          />

          <div className="flex justify-end mt-4">
            <button
              onClick={handleReset}
              disabled={isResetDisabled}
              className={`p-2 rounded ${
                isResetDisabled
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              } w-full md:w-auto`}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
