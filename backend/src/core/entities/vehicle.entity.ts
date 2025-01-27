import { Vehicle as IVehicle } from "shared-types";

export class Vehicle implements IVehicle {
  constructor(
    public id: string,
    public manufacturer: string,
    public model: string,
    public year: number,
    public type: IVehicle["type"],
    public price: number,
    public fuelType: IVehicle["fuelType"],
    public transmission: string,
    public mileage?: number,
    public features: string[] = [],
    public images: string[] = [],
    public description = "",
    public createdAt = new Date(),
    public updatedAt = new Date(),
  ) {}
}
