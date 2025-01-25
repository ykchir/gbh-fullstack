export interface GetVehiclesFilters {
  manufacturer?: string;
  type?: string;
  year?: number;
  page?: number;
  limit?: number;
  sortBy?: "price" | "year";
  order?: "asc" | "desc";
}
