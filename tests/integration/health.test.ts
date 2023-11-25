import supertest from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app';
import { cleanDB } from '../clean-db';

const api = supertest(app);

beforeEach(async () => {
  await cleanDB();
});

describe('GET /health', () => {
  it('should return status 200 and an ok message', async () => {
    const { status, text } = await api.get('/health');
    expect(status).toBe(httpStatus.OK);
    expect(text).toBe("I'm ok!");
  });
});
