import { GetVehiclesUseCase } from "../../src/application/use-cases/get-vehicles.use-case";
import { VehicleRepository } from "../../src/core/interfaces/vehicle.repository";
import { MOCK_VEHICLES } from "../../src/fixtures/mock-vehicles";
import { Vehicle } from "../../src/core/entities/vehicle.entity";

describe("GetVehiclesUseCase", () => {
  let getVehiclesUseCase: GetVehiclesUseCase;
  let mockVehicleRepository: VehicleRepository;

  beforeEach(() => {
    mockVehicleRepository = {
      findAll: jest.fn((filters) => {
        let vehicles = MOCK_VEHICLES.map(
          (data) =>
            new Vehicle(
              data.id,
              data.manufacturer,
              data.model,
              data.year,
              data.type,
              data.price,
              data.fuelType,
              data.transmission,
              data.mileage,
              data.features,
              data.images,
              data.description,
            ),
        );

        if (filters?.manufacturer) {
          vehicles = vehicles.filter(
            (v) => v.manufacturer === filters.manufacturer,
          );
        }
        if (filters?.type) {
          vehicles = vehicles.filter((v) => v.type === filters.type);
        }
        if (filters?.year) {
          vehicles = vehicles.filter((v) => v.year === filters.year);
        }

        if (filters?.sortBy) {
          vehicles.sort((a, b) => {
            const fieldA = a[filters.sortBy as keyof Vehicle];
            const fieldB = b[filters.sortBy as keyof Vehicle];

            if (fieldA === undefined || fieldB === undefined) {
              throw new Error(`Invalid sort field: ${filters.sortBy}`);
            }

            if (filters.order === "asc") {
              return fieldA > fieldB ? 1 : fieldA < fieldB ? -1 : 0;
            } else {
              return fieldA < fieldB ? 1 : fieldA > fieldB ? -1 : 0;
            }
          });
        }

        const page = filters.page ?? 1;
        const limit = filters.limit ?? 10;
        const start = (page - 1) * limit;
        const end = start + limit;
        return Promise.resolve({
          data: vehicles.slice(start, end),
          total: vehicles.length,
        });
      }),
      findById: jest.fn((id) => {
        const vehicle = MOCK_VEHICLES.find((v) => v.id === id);
        if (vehicle) {
          return Promise.resolve({
            ...vehicle,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
        return Promise.resolve(null);
      }),
      getAllManufacturers: jest.fn(() => Promise.resolve([])),
      getAllYears: jest.fn(() => Promise.resolve([])),
      getAllTypes: jest.fn(() => Promise.resolve([])),
    };

    getVehiclesUseCase = new GetVehiclesUseCase(mockVehicleRepository);
  });

  it("should return a list of vehicles with no filters", async () => {
    const result = await getVehiclesUseCase.execute({ page: 1, limit: 10 });
    expect(result.data).toHaveLength(10);
    expect(result.total).toBe(MOCK_VEHICLES.length);
    expect(mockVehicleRepository.findAll).toHaveBeenCalledWith({});
  });

  it("should return filtered vehicles by type", async () => {
    const result = await getVehiclesUseCase.execute({ type: "SUV", page: 1, limit: 5 });
    expect(result.data.every((v) => v.type === "SUV")).toBeTruthy();
    expect(result.total).toBeGreaterThan(0);
    expect(mockVehicleRepository.findAll).toHaveBeenCalledWith({ type: "SUV" });
  });

  it("should return filtered vehicles by year", async () => {
    const result = await getVehiclesUseCase.execute({ year: 2022, page: 1, limit: 5 });
    expect(result.data.every((v) => v.year === 2022)).toBeTruthy();
    expect(result.total).toBeGreaterThan(0);
    expect(mockVehicleRepository.findAll).toHaveBeenCalledWith({ year: 2022 });
  });

  it("should return vehicles sorted by price in ascending order", async () => {
    const result = await getVehiclesUseCase.execute({
      sortBy: "price",
      order: "asc",
      page: 1,
      limit: 5,
    });
    const prices = result.data.map((v) => v.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    expect(mockVehicleRepository.findAll).toHaveBeenCalledWith({});
  });

  it("should return vehicles sorted by year in descending order", async () => {
    const result = await getVehiclesUseCase.execute({
      sortBy: "year",
      order: "desc",
      page: 1,
      limit: 5,
    });
    const years = result.data.map((v) => v.year);
    expect(years).toEqual([...years].sort((a, b) => b - a));
    expect(mockVehicleRepository.findAll).toHaveBeenCalledWith({});
  });

  it("should return paginated results", async () => {
    const result = await getVehiclesUseCase.execute({ page: 2, limit: 5 });
    expect(result.data).toHaveLength(5);
    expect(result.total).toBe(MOCK_VEHICLES.length);
    expect(mockVehicleRepository.findAll).toHaveBeenCalledWith({});
  });

  it("should return an empty array if no vehicles match the filters", async () => {
    const result = await getVehiclesUseCase.execute({
      manufacturer: "Unknown",
      page: 1,
      limit: 5,
    });
    expect(result.data).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(mockVehicleRepository.findAll).toHaveBeenCalledWith({ manufacturer: "Unknown" });
  });
});
