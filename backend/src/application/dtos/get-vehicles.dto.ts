import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class GetVehiclesDto {
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  type?: string;

  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Type(() => Number)
  year?: number;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: "page must not be less than 1" })
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: "limit must not be less than 1" })
  @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @IsEnum(["price", "year"])
  sortBy?: "price" | "year";

  @IsOptional()
  @IsEnum(["asc", "desc"])
  order?: "asc" | "desc";
}
