"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FilterSelect from "./FilterSelect";
import { GetVehiclesFilters } from "@/types/api/vehicles";

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
      <FilterSelect
        label="Manufacturer"
        options={manufacturers.map((m) => ({ label: m, value: m }))}
        value={filters.manufacturer || ""}
        onChange={(value) => handleChange("manufacturer", String(value))}
      />

      <FilterSelect
        label="Type"
        options={types.map((t) => ({ label: t, value: t }))}
        value={filters.type || ""}
        onChange={(value) => handleChange("type", String(value))}
      />

      <FilterSelect
        label="Year"
        options={years.map((y) => ({ label: y.toString(), value: y }))}
        value={filters.year || ""}
        onChange={(value) => handleChange("year", Number(value))}
      />
    </div>
  );
}
