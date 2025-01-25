import * as supertest from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/infrastructure/http/nest/app.module';

describe('VehicleController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return a list of all vehicles (no filters)', async () => {
    await supertest(app.getHttpServer())
      .get('/api/vehicles?page=1&limit=10')
      .expect(200)
      .expect((response) => {
        expect(response.body.vehicles).toHaveLength(10);
        expect(response.body.total).toBe(10);
      });
  });

  it('should filter vehicles by manufacturer', async () => {
    await supertest(app.getHttpServer())
      .get('/api/vehicles?manufacturer=Tesla&page=1&limit=5')
      .expect(200)
      .expect((response) => {
        expect(response.body.vehicles.every((v) => v.manufacturer === 'Tesla')).toBeTruthy();
      });
  });

  it('should return filters for vehicles (manufacturers, years, and types)', async () => {
    await supertest(app.getHttpServer())
      .get('/api/vehicles/filters')
      .expect(200)
      .expect((response) => {
        const { manufacturers, years, types } = response.body;

        expect(Array.isArray(manufacturers)).toBe(true);
        expect(Array.isArray(years)).toBe(true);
        expect(Array.isArray(types)).toBe(true);

        expect(manufacturers).toContain('Tesla');
        expect(years).toContain(2023);
        expect(types).toContain('SUV');
      });
  });
});
