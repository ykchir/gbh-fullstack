import { VehicleType } from "shared-types";
import { GetFiltersUseCase } from "../../src/application/use-cases/get-filters.use-case";
import { VehicleRepository } from "../../src/core/interfaces/vehicle.repository";

describe("GetFiltersUseCase", () => {
  let getFiltersUseCase: GetFiltersUseCase;
  let mockVehicleRepository: VehicleRepository;

  beforeEach(() => {
    mockVehicleRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      getAllManufacturers: jest.fn(() =>
        Promise.resolve(["Toyota", "Honda", "Tesla"]),
      ),
      getAllYears: jest.fn(() => Promise.resolve([2023, 2022, 2021])),
      getAllTypes: jest.fn(() =>
        Promise.resolve(["SUV", "Sedan", "Truck"] as VehicleType[]),
      ),
    };

    getFiltersUseCase = new GetFiltersUseCase(mockVehicleRepository);
  });

  it("should return all filters (manufacturers, years, types)", async () => {
    const result = await getFiltersUseCase.execute();

    expect(result).toBeDefined();
    expect(result.manufacturers).toEqual(["Toyota", "Honda", "Tesla"]);
    expect(result.years).toEqual([2023, 2022, 2021]);
    expect(result.types).toEqual(["SUV", "Sedan", "Truck"]);

    expect(mockVehicleRepository.getAllManufacturers).toHaveBeenCalledTimes(1);
    expect(mockVehicleRepository.getAllYears).toHaveBeenCalledTimes(1);
    expect(mockVehicleRepository.getAllTypes).toHaveBeenCalledTimes(1);
  });

  it("should handle empty filters (no data in repository)", async () => {
    mockVehicleRepository.getAllManufacturers = jest.fn(() =>
      Promise.resolve([]),
    );
    mockVehicleRepository.getAllYears = jest.fn(() => Promise.resolve([]));
    mockVehicleRepository.getAllTypes = jest.fn(() => Promise.resolve([]));

    const result = await getFiltersUseCase.execute();

    expect(result).toBeDefined();
    expect(result.manufacturers).toEqual([]);
    expect(result.years).toEqual([]);
    expect(result.types).toEqual([]);
  });

  it("should throw an error if repository methods fail", async () => {
    mockVehicleRepository.getAllManufacturers = jest.fn(() =>
      Promise.reject(new Error("Failed to fetch filters.")),
    );

    await expect(getFiltersUseCase.execute()).rejects.toThrow(
      "Failed to fetch filters.",
    );

    expect(mockVehicleRepository.getAllManufacturers).toHaveBeenCalledTimes(1);
  });
});
