import { GetVehiclesUseCase } from '../../src/application/use-cases/get-vehicles.use-case';
import { VehicleRepository } from '../../src/core/interfaces/vehicle.repository';
import { MOCK_VEHICLES } from '../../src/fixtures/mock-vehicles';
import { Vehicle } from '../../src/core/entities/vehicle.entity';

describe('GetVehiclesUseCase', () => {
  let getVehiclesUseCase: GetVehiclesUseCase;
  let mockVehicleRepository: VehicleRepository;

  beforeEach(() => {
    mockVehicleRepository = {
      findAll: jest.fn((filters) =>
        Promise.resolve(
          MOCK_VEHICLES.map(
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
          ).filter((vehicle) => {
            let matches = true;
            if (filters?.manufacturer) {
              matches = matches && vehicle.manufacturer === filters.manufacturer;
            }
            if (filters?.type) {
              matches = matches && vehicle.type === filters.type;
            }
            if (filters?.year) {
              matches = matches && vehicle.year === filters.year;
            }
            return matches;
          }),
        ),
      ),
    } as VehicleRepository;

    getVehiclesUseCase = new GetVehiclesUseCase(mockVehicleRepository);
  });

  it('should return a list of vehicles with no filters', async () => {
    const vehicles = await getVehiclesUseCase.execute();
    expect(vehicles).toHaveLength(MOCK_VEHICLES.length);
    expect(vehicles[0].manufacturer).toBe('Tesla');
    expect(mockVehicleRepository.findAll).toHaveBeenCalledWith({});
    expect(mockVehicleRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return filtered vehicles by type', async () => {
    const vehicles = await getVehiclesUseCase.execute({ type: 'SUV' });
    expect(vehicles).toHaveLength(2); // Deux véhicules sont de type SUV
    expect(vehicles.every((v) => v.type === 'SUV')).toBeTruthy();
    expect(mockVehicleRepository.findAll).toHaveBeenCalledWith({ type: 'SUV' });
  });

  it('should return filtered vehicles by year', async () => {
    const vehicles = await getVehiclesUseCase.execute({ year: 2022 });
    expect(vehicles).toHaveLength(4); // Quatre véhicules correspondent à l'année 2022
    expect(vehicles.every((v) => v.year === 2022)).toBeTruthy();
    expect(mockVehicleRepository.findAll).toHaveBeenCalledWith({ year: 2022 });
  });
});
