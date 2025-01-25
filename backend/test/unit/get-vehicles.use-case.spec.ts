import { GetVehiclesUseCase } from '../../src/application/use-cases/get-vehicles.use-case';
import { VehicleRepository } from '../../src/core/interfaces/vehicle.repository';
import { Vehicle } from '../../src/core/entities/vehicle.entity';
import { VehicleType, FuelType } from 'shared-types';

describe('GetVehiclesUseCase', () => {
  let getVehiclesUseCase: GetVehiclesUseCase;
  let mockVehicleRepository: VehicleRepository;

  beforeEach(() => {
    mockVehicleRepository = {
      findAll: jest.fn().mockResolvedValue([
        new Vehicle(
          '1',
          'Tesla',
          'Model S',
          2022,
          VehicleType.ELECTRIC,
          89999,
          FuelType.ELECTRIC,
          'Automatic',
          0,
          ['Autopilot'],
          ['image1.jpg'],
          'Description',
        ),
        new Vehicle(
          '2',
          'BMW',
          'X5',
          2021,
          VehicleType.SUV,
          75000,
          FuelType.GASOLINE,
          'Automatic',
          15000,
          ['Leather seats'],
          ['image2.jpg'],
          'Luxury SUV',
        ),
      ]),
    } as VehicleRepository;

    getVehiclesUseCase = new GetVehiclesUseCase(mockVehicleRepository);
  });

  it('should return a list of vehicles', async () => {
    const vehicles = await getVehiclesUseCase.execute();
    expect(vehicles).toHaveLength(2);
    expect(vehicles[0].manufacturer).toBe('Tesla');
    expect(vehicles[1].model).toBe('X5');
    expect(mockVehicleRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
