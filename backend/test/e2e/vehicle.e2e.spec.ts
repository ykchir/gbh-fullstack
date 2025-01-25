import * as supertest from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/infrastructure/http/nest/app.module';

describe('VehicleController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/vehicles (GET)', () => {
    return supertest(app.getHttpServer())
      .get('/vehicles')
      .expect(200)
      .expect((response) => {
        expect(response.body).toHaveLength(10);
        expect(response.body[0].manufacturer).toBe('Tesla');
      });
  });
});
