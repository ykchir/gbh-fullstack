import * as supertest from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/infrastructure/http/nest/app.module';
import { MOCK_VEHICLES } from '../../src/fixtures/mock-vehicles';

describe('VehicleController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should return a list of all vehicles (no filters)', async () => {
    return supertest(app.getHttpServer())
      .get('/api/vehicles?page=1&limit=10')
      .expect(200)
      .expect((response) => {
        expect(response.body.vehicles).toHaveLength(10);
        expect(response.body.total).toBe(MOCK_VEHICLES.length);
        expect(response.body.vehicles[0].manufacturer).toBe('Tesla');
      });
  });

  it('should filter vehicles by manufacturer', async () => {
    return supertest(app.getHttpServer())
      .get('/api/vehicles?manufacturer=Tesla&page=1&limit=5')
      .expect(200)
      .expect((response) => {
        expect(response.body.vehicles).toHaveLength(1);
        expect(response.body.vehicles[0].manufacturer).toBe('Tesla');
        expect(response.body.total).toBe(1);
      });
  });

  it('should return an empty array if no vehicles match the filters', async () => {
    return supertest(app.getHttpServer())
      .get('/api/vehicles?manufacturer=Unknown&page=1&limit=5')
      .expect(200)
      .expect((response) => {
        expect(response.body.vehicles).toHaveLength(0);
        expect(response.body.total).toBe(0);
      });
  });

  it('should return paginated results', async () => {
    return supertest(app.getHttpServer())
      .get('/api/vehicles?page=2&limit=5')
      .expect(200)
      .expect((response) => {
        expect(response.body.vehicles).toHaveLength(5);
        expect(response.body.total).toBe(MOCK_VEHICLES.length);
      });
  });
});
