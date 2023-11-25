// import supertest from 'supertest';
// import httpStatus from 'http-status';
// import app from '../../src/app';
import { cleanDB } from '../clean-db';

// const api = supertest(app);

beforeEach(async () => {
  await cleanDB();
});

describe('description', () => {
  it('should work', async () => {
    expect(true).toBe(true);
  });
});
