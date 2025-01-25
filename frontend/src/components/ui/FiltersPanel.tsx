"use client";

import { GetVehiclesFilters } from "@/types/api/vehicles";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

  return (
    <div className="flex flex-col gap-4 p-4 border rounded">
      <select
        onChange={(e) => handleChange("manufacturer", e.target.value)}
        className="p-2 border rounded"
        value={filters.manufacturer || ""}
      >
        <option value="">All Manufacturers</option>
        {manufacturers.map((manufacturer) => (
          <option key={manufacturer} value={manufacturer}>
            {manufacturer}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => handleChange("type", e.target.value)}
        className="p-2 border rounded"
        value={filters.type || ""}
      >
        <option value="">All Types</option>
        {types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => handleChange("year", Number(e.target.value))}
        className="p-2 border rounded"
        value={filters.year || ""}
      >
        <option value="">All Years</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <select
        onChange={(e) =>
          handleChange("sortBy", e.target.value as "price" | "year")
        }
        className="p-2 border rounded"
        value={filters.sortBy || ""}
      >
        <option value="">Sort By</option>
        <option value="price">Price</option>
        <option value="year">Year</option>
      </select>

      <select
        onChange={(e) =>
          handleChange("order", e.target.value as "asc" | "desc")
        }
        className="p-2 border rounded"
        value={filters.order || ""}
        disabled={!filters.sortBy}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}
