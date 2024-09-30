import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { AppModule } from '@transactions-api/app.module';
import * as request from 'supertest';

describe('AuthController (e2e)', () => {
  jest.setTimeout(60000);
  let app: INestApplication;
  let postgresContainer;

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
  });

  afterAll(async () => {
    await app.close();
    await postgresContainer.stop();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'testuser',
          password: 'testpassword',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toEqual('testuser');
    });

    it('should fail if username already exists', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'existinguser',
          password: 'testpassword',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'existinguser',
          password: 'testpassword2',
        })
        .expect(409);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('Username already exists');
    });

    it('should fail if username is not provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          password: 'testpassword',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Username is required');
    });

    it('should fail if password is not provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'testuser2',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Password is required');
    });
  });

  describe('POST /auth/login', () => {
    beforeAll(async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'testuser3',
          password: 'testpassword3',
        })
        .expect(201);
    });

    it('should login with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'testuser3',
          password: 'testpassword3',
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('tokenType');
      expect(response.body.tokenType).toEqual('Bearer');
    });

    it('should fail to login with invalid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'testuser3',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('Invalid credentials');
    });

    it('should fail if username is not provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          password: 'testpassword3',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Username is required');
    });

    it('should fail if password is not provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'testuser3',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Password is required');
    });
  });
});
