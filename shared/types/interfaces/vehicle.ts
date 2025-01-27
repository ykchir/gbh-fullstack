import { VehicleType } from '../enums/vehicle-type';
import { FuelType } from '../enums/fuel-type';

export interface Vehicle {
  id: string;
  manufacturer: string;
  model: string;
  year: number;
  type: VehicleType;
  price: number;
  fuelType: FuelType;
  transmission: string;
  mileage?: number;
  features: string[];
  images: string[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
