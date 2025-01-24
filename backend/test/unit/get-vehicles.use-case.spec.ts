import { GetVehiclesUseCase } from '../../src/application/use-cases/get-vehicles.use-case';
import { VehicleRepository } from '../../src/core/interfaces/vehicle.repository';
import { Vehicle } from '../../src/core/entities/vehicle.entity';

describe('GetVehiclesUseCase', () => {
  let getVehiclesUseCase: GetVehiclesUseCase;
  let mockVehicleRepository: VehicleRepository;

  beforeEach(() => {
    mockVehicleRepository = {
      findAll: jest.fn().mockResolvedValue([
        new Vehicle('1', 'Tesla', 'Model S', 2022, 89999),
        new Vehicle('2', 'BMW', 'X5', 2021, 75000),
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
