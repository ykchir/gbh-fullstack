import { GetVehicleDetailsUseCase } from "../../src/application/use-cases/get-vehicle-details.use-case";
import { VehicleRepository } from "../../src/core/interfaces/vehicle.repository";
import { MOCK_VEHICLES } from "../../src/fixtures/mock-vehicles";

describe("GetVehicleDetailsUseCase", () => {
  let getVehicleDetailsUseCase: GetVehicleDetailsUseCase;
  let mockVehicleRepository: VehicleRepository;

  beforeEach(() => {
    mockVehicleRepository = {
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
      findAll: jest.fn(() => Promise.resolve({ data: [], total: 0 })),
    };

    getVehicleDetailsUseCase = new GetVehicleDetailsUseCase(mockVehicleRepository);
  });

  it("should return a vehicle for a valid ID", async () => {
    const result = await getVehicleDetailsUseCase.execute("1");
    expect(result).toBeDefined();
    expect(result.id).toBe("1");
  });

  it("should throw an error for an invalid ID", async () => {
    await expect(getVehicleDetailsUseCase.execute("999")).rejects.toThrow(
      "Vehicle with ID 999 not found.",
    );
  });
});
