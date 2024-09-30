import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { AppModule } from '@transactions-api/app.module';
import { IdVO } from '@transactions-api/shared/domain/value-objects/id.vo';
import * as request from 'supertest';

describe('TransactionController (e2e)', () => {
  jest.setTimeout(60000);
  let app: INestApplication;
  let postgresContainer;

  let fromAccountId: IdVO;
  let toAccountId: IdVO;
  let transactionId: IdVO;
  let adminId: IdVO;
  let accessToken: string;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start();

    process.env.DB_TYPE = 'postgres';
    process.env.DB_HOST = postgresContainer.getHost();
    process.env.DB_PORT = postgresContainer.getMappedPort(5432).toString();
    process.env.DB_USERNAME = 'test';
    process.env.DB_PASSWORD = 'test';
    process.env.DB_NAME = 'test';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: 'testuser', password: 'testpassword' });

    accessToken = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpassword' })
      .then((res) => res.body.accessToken);

    fromAccountId = new IdVO();
    toAccountId = new IdVO();
    adminId = new IdVO();
  });

  afterAll(async () => {
    await app.close();
    await postgresContainer.stop();
  });

  describe('POST /transactions/request', () => {
    it('should request a new transaction', async () => {
      const payload = {
        fromAccountId: fromAccountId.getValue(),
        toAccountId: toAccountId.getValue(),
        amount: 100.0,
        description: 'Test Transaction',
      };

      const response = await request(app.getHttpServer())
        .post('/transactions/request')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.amount).toEqual(100.0);
      expect(response.body.description).toEqual('Test Transaction');

      transactionId = response.body.id;
    });

    it('should fail to request a transaction if amount is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/transactions/request')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          fromAccountId: fromAccountId,
          toAccountId: toAccountId,
          amount: -50.0,
          description: 'Invalid Transaction',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain(
        'Amount must be greater than zero',
      );
    });

    describe('POST /transactions/:id/approve', () => {
      it('should approve a transaction', async () => {
        await request(app.getHttpServer())
          .post('/transactions/request')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            fromAccountId: fromAccountId.getValue(),
            toAccountId: toAccountId.getValue(),
            amount: 100.0,
            description: 'Test Transaction',
          });

        const adminAccessToken = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ username: 'adminUser', password: 'adminPassword' })
          .then((res) => res.body.accessToken);

        const response = await request(app.getHttpServer())
          .put(`/transactions/${transactionId}/approve`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send({ adminId: adminId.getValue() })
          .expect(200);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual('APPROVED');
      });

      it('should fail to approve a transaction that does not exist', async () => {
        const adminAccessToken = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ username: 'adminUser', password: 'adminPassword' })
          .then((res) => res.body.accessToken);

        const response = await request(app.getHttpServer())
          .put('/transactions/00000000-0000-0000-0000-000000000000/approve')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send({ adminId: adminId.getValue() })
          .expect(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual(
          'Transaction with id 00000000-0000-0000-0000-000000000000 not found',
        );
      });
    });

    describe('POST /transactions/:id/reject', () => {
      it('should reject a transaction', async () => {
        await request(app.getHttpServer())
          .post('/transactions/request')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            fromAccountId: fromAccountId.getValue(),
            toAccountId: toAccountId.getValue(),
            amount: 100.0,
            description: 'Test Transaction',
          });

        await request(app.getHttpServer())
          .post('/auth/register')
          .send({ username: 'adminUser', password: 'adminPassword' });

        const adminAccessToken = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ username: 'adminUser', password: 'adminPassword' })
          .then((res) => res.body.accessToken);

        const response = await request(app.getHttpServer())
          .put(`/transactions/${transactionId}/reject`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send({ adminId: adminId.getValue() })
          .expect(200);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual('REJECTED');
      });

      it('should fail to reject a transaction that does not exist', async () => {
        const adminAccessToken = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ username: 'adminUser', password: 'adminPassword' })
          .then((res) => res.body.accessToken);

        const response = await request(app.getHttpServer())
          .put('/transactions/00000000-0000-0000-0000-000000000000/reject')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send({ adminId: adminId.getValue() })
          .expect(404);

        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual(
          'Transaction with id 00000000-0000-0000-0000-000000000000 not found',
        );
      });
    });
  });
});
