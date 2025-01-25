import { VehicleType } from "shared-types";

export class GetFiltersResponseDto {
  manufacturers: string[];
  years: number[];
  types: VehicleType[];

  constructor(
    manufacturers: string[] = [],
    years: number[] = [],
    types: VehicleType[] = [],
  ) {
    this.manufacturers = manufacturers;
    this.years = years;
    this.types = types;
  }
}
