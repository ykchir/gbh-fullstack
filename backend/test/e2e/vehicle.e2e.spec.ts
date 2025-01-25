import * as supertest from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/infrastructure/http/nest/app.module';

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
      .get('/api/vehicles')
      .expect(200)
      .expect((response) => {
        expect(response.body).toHaveLength(10); // Adaptez ce nombre si nécessaire
        expect(response.body[0].manufacturer).toBe('Tesla');
      });
  });

  it('should filter vehicles by manufacturer', async () => {
    return supertest(app.getHttpServer())
      .get('/api/vehicles?manufacturer=Tesla')
      .expect(200)
      .expect((response) => {
        expect(response.body).toHaveLength(1); // Adaptez ce nombre si nécessaire
        expect(response.body[0].manufacturer).toBe('Tesla');
      });
  });

  it('should return an empty array if no vehicles match the filters', async () => {
    return supertest(app.getHttpServer())
      .get('/api/vehicles?manufacturer=Unknown')
      .expect(200)
      .expect((response) => {
        expect(response.body).toHaveLength(0);
      });
  });
});
